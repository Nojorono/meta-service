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


    async getInvLocator(
        params?: InvOnHandQtyParamsDto,
    ): Promise<any> {
        const { organization_code, subinventory_code } = params || {};
        const organizationCode = organization_code ?? 'JAT';
        const cacheKey = `inv-locator-v1:${organizationCode}:${subinventory_code || 'all'}`;

        // try {
        //     const cachedData = await this.redisService.get(cacheKey);
        //     if (cachedData) {
        //         this.logger.log(`Cache hit for ${cacheKey}`);
        //         return JSON.parse(cachedData as string);
        //     }
        // } catch (error) {
        //     this.logger.error(
        //         `Error accessing Redis cache for locator data: ${error.message}`,
        //         error.stack,
        //     );
        // }

        try {
            let query = `
                SELECT
                    mp.organization_id,
                    haou.name,
                    mp.organization_code AS "Org Code",
                    haou.name AS "Organization Name",
                    msi.secondary_inventory_name AS "Subinventory",
                    msi.description AS "Subinventory Description",
                    mil.inventory_location_id AS "locator_id",
                    mil.segment1 AS "Locator",
                    mil.description AS "Locator Description",
                    DECODE(
                        msi.locator_type,
                        1, 'None',
                        2, 'Prespecified',
                        3, 'Dynamic',
                        4, 'Item Level',
                        5, 'Subinventory Level',
                        'Unknown'
                    ) AS "Locator Control Type"
                FROM mtl_secondary_inventories msi
                JOIN mtl_parameters mp
                    ON msi.organization_id = mp.organization_id
                JOIN hr_all_organization_units haou
                    ON mp.organization_id = haou.organization_id
                LEFT JOIN mtl_item_locations mil
                    ON msi.secondary_inventory_name = mil.subinventory_code
                    AND msi.organization_id = mil.organization_id
                WHERE mp.organization_code = :1
            `;
            const queryParams: any[] = [organizationCode];

            if (subinventory_code) {
                query += ` AND msi.secondary_inventory_name = :2`;
                queryParams.push(subinventory_code);
            }

            query += ` ORDER BY mp.organization_code, msi.secondary_inventory_name`;

            const result = await this.oracleService.executeQuery(query, queryParams);

            const response = {
                data: result.rows,
                count: result.rows.length,
                status: true,
                message: 'Locator data retrieved successfully',
            };

            // try {
            //     await this.redisService.set(
            //         cacheKey,
            //         JSON.stringify(response),
            //         this.CACHE_TTL,
            //     );
            //     this.logger.log(`Locator data stored in cache with key ${cacheKey}`);
            // } catch (cacheError) {
            //     this.logger.error(
            //         `Error storing locator data in Redis: ${cacheError.message}`,
            //         cacheError.stack,
            //     );
            // }

            return response;
        } catch (error) {
            this.logger.error(
                `Error in getInvLocator: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving locator data: ${error.message}`,
            };
        }
    }

    async getInvOnHandQtyFromOracle(
        params?: InvOnHandQtyParamsDto,
    ): Promise<InvOnHandQtyResponseDto> {
        const { item_code, subinventory_code, organization_code } = params || {};
        const organizationCode = organization_code ?? 'CWH';
        const subinventoryCodes = this.normalizeSubinventoryCodes(subinventory_code);

        // Generate unique cache key based on parameters
        const cacheKey = `inv-on-hand-qty-v2:${organizationCode}:${item_code || 'all'}:${this.buildSubinventoryCacheKey(subinventoryCodes)}`;

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
            WHERE a.ORGANIZATION_CODE = :1
      `;

            const queryParams: any[] = [organizationCode];
            let paramIndex = 2;

            // Add item_code filter if provided
            if (item_code) {
                query += ` AND a.ITEM_CODE = :${paramIndex}`;
                queryParams.push(item_code);
                paramIndex++;
            }

            // Add subinventory_code filter if provided
            if (subinventoryCodes.length === 1) {
                query += ` AND a.SUBINVENTORY_CODE = :${paramIndex}`;
                queryParams.push(subinventoryCodes[0]);
                paramIndex++;
            } else if (subinventoryCodes.length > 1) {
                const placeholders = subinventoryCodes
                    .map((_, index) => `:${paramIndex + index}`)
                    .join(', ');
                query += ` AND a.SUBINVENTORY_CODE IN (${placeholders})`;
                queryParams.push(...subinventoryCodes);
                paramIndex += subinventoryCodes.length;
            }

            // query += ` ORDER BY a.SUBINVENTORY_CODE, a.ITEM_CODE, a.SOURCE_UOM_CODE`;

            const result = await this.oracleService.executeQuery(query, queryParams);

            if (result.rows.length === 0) {
                const filterMsg = [
                    `org ${organizationCode}`,
                    item_code && `item ${item_code}`,
                    subinventoryCodes.length > 0 &&
                        `subinventory ${subinventoryCodes.join(', ')}`,
                ]
                    .filter(Boolean)
                    .join(', ');
                return {
                    data: [],
                    count: 0,
                    status: false,
                    message: filterMsg
                        ? `No inventory data found (${filterMsg})`
                        : 'No inventory data found',
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
                message: [
                    'ON_HAND_QUANTITY data',
                    `org ${organizationCode}`,
                    item_code && `item ${item_code}`,
                    subinventoryCodes.length > 0 &&
                        `subinventory ${subinventoryCodes.join(', ')}`,
                    'retrieved successfully',
                ]
                    .filter(Boolean)
                    .join(' '),
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
    async getOnHandMappingDetail(
        params?: Pick<InvOnHandQtyParamsDto, 'organization_code' | 'subinventory_code'>,
    ): Promise<{
        data: Record<string, unknown>[];
        count: number;
        status: boolean;
        message: string;
    }> {
        const organizationCode = params?.organization_code ?? 'CWH';
        const subinventoryCode = params?.subinventory_code ?? 'SELISIH';

        try {
            const headerQuery = `
                SELECT *
                FROM XTD_INV_ON_HAND_QTY_V
                WHERE ORGANIZATION_CODE = :1
                  AND SUBINVENTORY_CODE = :2
            `;

            const detailQuery = `
                SELECT
                  INV_ORG.ORGANIZATION_CODE,
                  INV_ORG.ORGANIZATION_NAME,
                  (
                    SELECT INV_ORG2.ORGANIZATION_CODE
                    FROM MTL_MATERIAL_TRANSACTIONS MMT,
                         XTD_ONT_BRANCHES_V INV_ORG2
                    WHERE MMT.TRANSACTION_ID = OHD.CREATE_TRANSACTION_ID
                      AND MMT.TRANSFER_ORGANIZATION_ID = INV_ORG2.ORGANIZATION_ID (+)
                  ) AS FROM_ORGANIZATION_CODE,
                  (
                    SELECT SEGMENT1 || '.' || SEGMENT2 || '.' || SEGMENT3
                    FROM MTL_SYSTEM_ITEMS_B MSI
                    WHERE MSI.INVENTORY_ITEM_ID = OHD.INVENTORY_ITEM_ID
                      AND MSI.ORGANIZATION_ID = OHD.ORGANIZATION_ID
                  ) AS ITEM_CODE,
                  (
                    SELECT MSI.DESCRIPTION
                    FROM MTL_SYSTEM_ITEMS_B MSI
                    WHERE MSI.INVENTORY_ITEM_ID = OHD.INVENTORY_ITEM_ID
                      AND MSI.ORGANIZATION_ID = OHD.ORGANIZATION_ID
                  ) AS ITEM_DESC,
                  OHD.ORGANIZATION_ID,
                  OHD.*
                FROM MTL_ONHAND_QUANTITIES_DETAIL OHD,
                     XTD_ONT_BRANCHES_V INV_ORG
                WHERE OHD.ORGANIZATION_ID = INV_ORG.ORGANIZATION_ID (+)
                  AND OHD.SUBINVENTORY_CODE = :1
                  AND INV_ORG.ORGANIZATION_CODE = :2
                ORDER BY INV_ORG.ORGANIZATION_CODE, OHD.DATE_RECEIVED DESC
            `;

            const [headerResult, detailResult] = await Promise.all([
                this.oracleService.executeQuery(headerQuery, [
                    organizationCode,
                    subinventoryCode,
                ]),
                this.oracleService.executeQuery(detailQuery, [
                    subinventoryCode,
                    organizationCode,
                ]),
            ]);

            const headers = headerResult.rows || [];
            const details = detailResult.rows || [];

            const linesByInventoryItemId = new Map<
                string,
                Record<string, unknown>[]
            >();
            const linesByItemCode = new Map<string, Record<string, unknown>[]>();

            for (const line of details) {
                const inventoryItemId = line.INVENTORY_ITEM_ID;
                if (inventoryItemId != null) {
                    const idKey = String(inventoryItemId);
                    if (!linesByInventoryItemId.has(idKey)) {
                        linesByInventoryItemId.set(idKey, []);
                    }
                    linesByInventoryItemId.get(idKey)!.push(line);
                }

                const detailItemCode = this.normalizeItemCode(line.ITEM_CODE);
                if (detailItemCode) {
                    if (!linesByItemCode.has(detailItemCode)) {
                        linesByItemCode.set(detailItemCode, []);
                    }
                    linesByItemCode.get(detailItemCode)!.push(line);
                }
            }

            const mapped = headers.map((header) => {
                const lines = this.getLinesForHeader(
                    header,
                    linesByInventoryItemId,
                    linesByItemCode,
                );
                return {
                    ...header,
                    ITEM_CODE: header.ITEM_CODE,
                    LINES: lines,
                    LINE_COUNT: lines.length,
                };
            });

            const matchedLineKeys = new Set<string>();
            for (const row of mapped) {
                for (const line of (row.LINES as Record<string, unknown>[]) || []) {
                    matchedLineKeys.add(this.getDetailLineKey(line));
                }
            }
            const unmatchedLines = details.filter(
                (line) => !matchedLineKeys.has(this.getDetailLineKey(line)),
            );

            const response: {
                data: Record<string, unknown>[];
                count: number;
                status: boolean;
                message: string;
                unmatched_lines?: Record<string, unknown>[];
            } = {
                data: mapped,
                count: mapped.length,
                status: true,
                message: [
                    'On hand mapping detail retrieved successfully',
                    `org ${organizationCode}`,
                    `subinventory ${subinventoryCode}`,
                    unmatchedLines.length > 0
                        ? `(${unmatchedLines.length} detail row(s) without matching header)`
                        : '',
                ]
                    .filter(Boolean)
                    .join(' '),
            };

            if (unmatchedLines.length > 0) {
                response.unmatched_lines = unmatchedLines;
            }

            return response;
        } catch (error) {
            this.logger.error(
                `Error in getOnHandMappingDetail: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving on hand mapping detail: ${error.message}`,
            };
        }
    }

    private normalizeItemCode(value: unknown): string {
        if (value == null) {
            return '';
        }
        return String(value).trim().toUpperCase();
    }

    /**
     * Header view uses short ITEM_CODE (e.g. BHM20); detail uses segment ITEM_CODE
     * (e.g. RK.BHM.200000, same as header ITEM_NUMBER). Match by INVENTORY_ITEM_ID first.
     */
    private getLinesForHeader(
        header: Record<string, unknown>,
        linesByInventoryItemId: Map<string, Record<string, unknown>[]>,
        linesByItemCode: Map<string, Record<string, unknown>[]>,
    ): Record<string, unknown>[] {
        const seen = new Set<string>();
        const lines: Record<string, unknown>[] = [];

        const addLines = (candidates: Record<string, unknown>[] | undefined) => {
            for (const line of candidates || []) {
                const key = this.getDetailLineKey(line);
                if (seen.has(key)) {
                    continue;
                }
                seen.add(key);
                lines.push(line);
            }
        };

        if (header.INVENTORY_ITEM_ID != null) {
            addLines(linesByInventoryItemId.get(String(header.INVENTORY_ITEM_ID)));
        }

        const headerItemCode = this.normalizeItemCode(header.ITEM_CODE);
        const headerItemNumber = this.normalizeItemCode(header.ITEM_NUMBER);
        if (headerItemCode) {
            addLines(linesByItemCode.get(headerItemCode));
        }
        if (headerItemNumber) {
            addLines(linesByItemCode.get(headerItemNumber));
        }

        return lines;
    }

    private getDetailLineKey(line: Record<string, unknown>): string {
        const inventoryItemId = line.INVENTORY_ITEM_ID ?? '';
        const createTxnId = line.CREATE_TRANSACTION_ID ?? '';
        const locatorId = line.LOCATOR_ID ?? '';
        const lotNumber = line.LOT_NUMBER ?? '';
        const dateReceived = line.DATE_RECEIVED ?? '';
        return [
            inventoryItemId,
            createTxnId,
            locatorId,
            lotNumber,
            dateReceived,
        ].join('|');
    }

    private normalizeSubinventoryCodes(
        subinventoryCode?: string | string[],
    ): string[] {
        if (!subinventoryCode) {
            return [];
        }

        const rawValues = Array.isArray(subinventoryCode)
            ? subinventoryCode
            : [subinventoryCode];

        return [
            ...new Set(
                rawValues
                    .flatMap((value) => value.split(','))
                    .map((value) => value.trim())
                    .filter(Boolean),
            ),
        ];
    }

    private buildSubinventoryCacheKey(subinventoryCodes: string[]): string {
        return subinventoryCodes.length > 0
            ? [...subinventoryCodes].sort().join(',')
            : 'all';
    }

    async invalidateInvOnHandQtyCache(
        itemCode?: string,
        subinventoryCode?: string,
        organizationCode?: string,
    ): Promise<void> {
        try {
            if (itemCode || subinventoryCode || organizationCode) {
                const org = organizationCode ?? 'CWH';
                const cacheKey = `inv-on-hand-qty-v2:${org}:${itemCode || 'all'}:${subinventoryCode || 'all'}`;
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
