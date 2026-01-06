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
import { SalesItemConversionService } from '../../sales-item-conversion/services/sales-item-conversion.service';
import { SalesItemConversionDto } from '../../sales-item-conversion/dtos/sales-item-conversion.dtos';

@Injectable()
export class InvOnHandQtyService {
    private readonly logger = new Logger(InvOnHandQtyService.name);
    private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

    constructor(
        private readonly configService: ConfigService,
        private readonly oracleService: OracleService,
        private readonly redisService: RedisService,
        private readonly salesItemConversionService: SalesItemConversionService,
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
            const inventoryData: InvOnHandQtyDto[] = await Promise.all(
                groupedData.map(async (group) => {
                    this.logger.log(`Processing group: ${group.SUBINVENTORY_CODE}, items count: ${group.items.length}`);

                    const items: ItemDto[] = await Promise.all(
                        group.items.map(async (item) => {
                            // Get conversion rates from SalesItemConversionService
                            const quantityConversions = await this.getQuantityConversions(
                                item.ITEM_CODE,
                                item.QUANTITY,
                                item.UOM,
                            );

                            return {
                                ITEM_CODE: item.ITEM_CODE,
                                QUANTITY: item.QUANTITY,
                                UOM: item.UOM,
                                QUANTITY_CONVERTION: quantityConversions,
                            };
                        }),
                    );

                    this.logger.log(`Final items array length: ${items.length}`);

                    return {
                        SUBINVENTORY_CODE: group.SUBINVENTORY_CODE,
                        ITEM: items,
                    };
                }),
            );

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

    /**
     * Get quantity conversions for an item using SalesItemConversionService
     * @param itemCode Item code to get conversions for
     * @param baseQuantity Quantity in base UOM
     * @param baseUom Base UOM code
     * @returns Array of quantity conversions
     */
    private async getQuantityConversions(
        itemCode: string,
        baseQuantity: number,
        baseUom: string,
    ): Promise<QuantityConversionDto[]> {
        try {
            // Get all conversions for this item
            const conversions = await this.salesItemConversionService.findAllSalesItemConversions({
                itemCode: itemCode,
                limit: 1000, // Get all conversions for the item
            });

            if (!conversions || conversions.length === 0) {
                this.logger.warn(`No conversions found for item ${itemCode}, returning base UOM only`);
                // Return only base UOM if no conversions found
                return [
                    {
                        UOM_CODE: baseUom,
                        QUANTITY: baseQuantity,
                    },
                ];
            }

            // Build conversion array
            const quantityConversions: QuantityConversionDto[] = [];
            const addedUomCodes = new Set<string>(); // Track added UOM codes to avoid duplicates

            // Add base UOM first
            quantityConversions.push({
                UOM_CODE: baseUom,
                QUANTITY: baseQuantity,
            });
            addedUomCodes.add(baseUom.toUpperCase()); // Track base UOM

            // Add conversions for each SOURCE_UOM_CODE
            conversions.forEach((conversion: SalesItemConversionDto) => {
                // Only process if BASE_UOM_CODE matches the item's base UOM
                if (conversion.BASE_UOM_CODE === baseUom && conversion.CONVERSION_RATE > 0) {
                    const sourceUomCode = conversion.SOURCE_UOM_CODE.toUpperCase();

                    // Skip if this UOM code is already added (avoid duplicates)
                    if (addedUomCodes.has(sourceUomCode)) {
                        this.logger.debug(
                            `Skipping duplicate UOM code ${conversion.SOURCE_UOM_CODE} for item ${itemCode}`,
                        );
                        return;
                    }

                    // Convert from base UOM to source UOM: divide by conversion rate
                    const convertedQuantity = baseQuantity / conversion.CONVERSION_RATE;

                    quantityConversions.push({
                        UOM_CODE: conversion.SOURCE_UOM_CODE,
                        QUANTITY: Math.round(convertedQuantity * 100) / 100, // Round to 2 decimal places
                    });
                    addedUomCodes.add(sourceUomCode); // Track added UOM
                }
            });

            this.logger.log(
                `Generated ${quantityConversions.length} conversions for item ${itemCode}`,
            );

            return quantityConversions;
        } catch (error) {
            this.logger.error(
                `Error getting quantity conversions for item ${itemCode}: ${error.message}`,
                error.stack,
            );
            // Return base UOM only on error
            return [
                {
                    UOM_CODE: baseUom,
                    QUANTITY: baseQuantity,
                },
            ];
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
            if (itemCode || subinventoryCode) {
                // Invalidate specific cache - use same key format as getInvOnHandQtyFromOracle
                const cacheKey = `inv-on-hand-qty-v2:${itemCode || 'all'}:${subinventoryCode || 'all'}`;
                await this.redisService.delete(cacheKey);
                this.logger.log(`Invalidated cache for key: ${cacheKey}`);
            } else {
                // Invalidate all inventory cache entries
                await this.redisService.deleteByPattern('inv-on-hand-qty-v2:*');
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
