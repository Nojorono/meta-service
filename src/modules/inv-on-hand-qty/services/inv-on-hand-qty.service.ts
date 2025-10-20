import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    InvOnHandQtyDto,
    InvOnHandQtyParamsDto,
    InvOnHandQtyResponseDto,
    ItemDto,
    QuantityConversionDto,
} from '../dtos/inv-on-hand-qty.dtos';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';

@Injectable()
export class InvOnHandQtyService {
    private readonly logger = new Logger(InvOnHandQtyService.name);
    private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

    constructor(
        private readonly configService: ConfigService,
        private readonly oracleService: OracleService,
        private readonly redisService: RedisService,
    ) { }

    async getInvOnHandQtyFromOracle(
        params?: InvOnHandQtyParamsDto,
    ): Promise<InvOnHandQtyResponseDto> {
        const { item_code, subinventory_code } = params || {};

        // Generate unique cache key based on parameters
        const cacheKey = `inv-on-hand-qty-v2:${item_code || 'all'}:${subinventory_code || 'all'}`;

        // Try to get data from cache first
        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                this.logger.log(`Cache hit for ${cacheKey}`);
                return JSON.parse(cachedData as string) as InvOnHandQtyResponseDto;
            }
            this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
        } catch (error) {
            this.logger.error(
                `Error accessing Redis cache: ${error.message}`,
                error.stack,
            );
            // Continue with database query if cache access fails
        }

        try {
            // Build dynamic query based on provided parameters
            let query = `
            SELECT 
                a.SUBINVENTORY_CODE,  
                a.ITEM_CODE, 
                a.QUANTITY, 
                b.BASE_UOM_CODE AS UOM, 
                (a.QUANTITY / b.CONVERSION_RATE ) as CONVERTED_QUANTITY, 
                b.SOURCE_UOM_CODE AS UOM
            FROM XTD_INV_ON_HAND_QTY_V a
            LEFT JOIN APPS.XTD_INV_SALES_ITEM_CONVERSIONS_V b ON b.ITEM_CODE = a.ITEM_CODE 
            WHERE a.ORGANIZATION_CODE = 'CWH'
      `;

            const queryParams = [];

            // Add item_code filter if provided
            if (item_code) {
                query += ` AND a.ITEM_CODE = :item_code`;
                queryParams.push(item_code);
            }

            // Add subinventory_code filter if provided
            if (subinventory_code) {
                query += ` AND a.SUBINVENTORY_CODE = :subinventory_code`;
                queryParams.push(subinventory_code);
            }

            // query += ` ORDER BY a.SUBINVENTORY_CODE, a.ITEM_CODE, a.SOURCE_UOM_CODE`;

            const result = await this.oracleService.executeQuery(query, queryParams);

            if (result.rows.length === 0) {
                const filterMsg = item_code && subinventory_code
                    ? `for item ${item_code} in subinventory ${subinventory_code}`
                    : item_code
                        ? `for item ${item_code}`
                        : subinventory_code
                            ? `in subinventory ${subinventory_code}`
                            : '';
                return {
                    data: [],
                    count: 0,
                    status: false,
                    message: `No inventory data found ${filterMsg}`,
                };
            }

            // Group data by subinventory and item
            const groupedData = this.groupInventoryData(result.rows);
            this.logger.log(`Grouped data length: ${groupedData.length}`);
            this.logger.log(`First group items length: ${groupedData[0]?.items?.length || 0}`);

            // Transform to the expected format
            const inventoryData: InvOnHandQtyDto[] = groupedData.map((group) => {
                this.logger.log(`Processing group: ${group.SUBINVENTORY_CODE}, items count: ${group.items.length}`);

                const items: ItemDto[] = group.items.map((item) => {
                    // For now, create mock conversion data since we simplified the query
                    const quantityConversions: QuantityConversionDto[] = [
                        { UOM_CODE: 'DUS', QUANTITY: Math.round(item.QUANTITY / 600) },
                        { UOM_CODE: 'BAL', QUANTITY: Math.round(item.QUANTITY / 100) },
                        { UOM_CODE: 'PRS', QUANTITY: Math.round(item.QUANTITY / 10) },
                        { UOM_CODE: 'BTG', QUANTITY: item.QUANTITY },
                    ];

                    return {
                        ITEM_CODE: item.ITEM_CODE,
                        QUANTITY: item.QUANTITY,
                        UOM: item.UOM,
                        QUANTITY_CONVERTION: quantityConversions,
                    };
                });

                this.logger.log(`Final items array length: ${items.length}`);

                return {
                    SUBINVENTORY_CODE: group.SUBINVENTORY_CODE,
                    ITEM: items,
                };
            });

            // Prepare response
            const response: InvOnHandQtyResponseDto = {
                data: inventoryData,
                count: inventoryData.length,
                status: true,
                message: item_code && subinventory_code
                    ? `ON_HAND_QUANTITY data for ${item_code} in ${subinventory_code} retrieved successfully`
                    : item_code
                        ? `ON_HAND_QUANTITY data for ${item_code} retrieved successfully`
                        : subinventory_code
                            ? `ON_HAND_QUANTITY data in ${subinventory_code} retrieved successfully`
                            : 'ON_HAND_QUANTITY data retrieved successfully',
            };

            // Store in Redis cache
            try {
                await this.redisService.set(
                    cacheKey,
                    JSON.stringify(response),
                    this.CACHE_TTL,
                );
                this.logger.log(`Data stored in cache with key ${cacheKey}`);
            } catch (cacheError) {
                this.logger.error(
                    `Error storing data in Redis: ${cacheError.message}`,
                    cacheError.stack,
                );
                // Continue even if cache storage fails
            }

            return response;
        } catch (error) {
            this.logger.error(
                `Error in getInvOnHandQtyFromOracle: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving inventory data: ${error.message}`,
            };
        }
    }

    private groupInventoryData(rows: any[]): any[] {
        const groups = new Map();

        rows.forEach((row) => {
            const subinventoryKey = row.SUBINVENTORY_CODE;

            if (!groups.has(subinventoryKey)) {
                groups.set(subinventoryKey, {
                    SUBINVENTORY_CODE: row.SUBINVENTORY_CODE,
                    items: new Map(),
                });
            }

            const group = groups.get(subinventoryKey);
            const itemKey = row.ITEM_CODE;

            if (!group.items.has(itemKey)) {
                group.items.set(itemKey, {
                    ITEM_CODE: row.ITEM_CODE,
                    QUANTITY: row.QUANTITY,
                    UOM: row.UOM,
                });
            }
        });

        // Convert Map to Array
        return Array.from(groups.values()).map((group) => ({
            SUBINVENTORY_CODE: group.SUBINVENTORY_CODE,
            items: Array.from(group.items.values()),
        }));
    }

    /**
     * Invalidates inventory-related caches
     * @param itemCode Optional item code to invalidate specific cache
     * @param subinventoryCode Optional subinventory code to invalidate specific cache
     */
    async invalidateInvOnHandQtyCache(itemCode?: string, subinventoryCode?: string): Promise<void> {
        try {
            if (itemCode && subinventoryCode) {
                // Invalidate specific cache
                const cacheKey = `inv-on-hand-qty:${itemCode}:${subinventoryCode}`;
                await this.redisService.delete(cacheKey);
                this.logger.log(`Invalidated cache for item ${itemCode} in subinventory ${subinventoryCode}`);
            } else {
                // Invalidate all inventory cache entries
                await this.redisService.deleteByPattern('inv-on-hand-qty:*');
                this.logger.log('Invalidated all inventory on hand quantity caches');
            }
        } catch (error) {
            this.logger.error(
                `Error invalidating cache: ${error.message}`,
                error.stack,
            );
        }
    }
}
