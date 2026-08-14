import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import {
  MetaItemListDto,
  MetaItemListDtoByItemCode,
  MetaItemListDtoByInventoryItemId,
  MetaItemListResponseDto,
  ItemListQueryDto,
} from '../dtos/item-list.dtos';

@Injectable()
export class ItemListMetaService {
  private readonly logger = new Logger(ItemListMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour
  private readonly CACHE_VERSION = 'v4';

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) { }

  private readonly conversionJoinSql = `
    LEFT JOIN (
      SELECT DISTINCT
        (
          SELECT MAX(CATEGORY_CONCAT_SEGS)
          FROM MTL_ITEM_CATEGORIES_V
          WHERE 1 = 1
            AND INVENTORY_ITEM_ID = mcr.INVENTORY_ITEM_ID
            AND CATEGORY_SET_NAME = 'Principal Category'
        ) Principle,
        MCR.CROSS_REFERENCE ITEM_CODE,
        mcr.INVENTORY_ITEM_ID,
        MCR.ATTRIBUTE6,
        mtls.inventory_item_status_code status_code,
        CASE
          WHEN REGEXP_LIKE(TRIM(MCR.ATTRIBUTE7), '^[0-9]+(\\.[0-9]+)?$')
          THEN TO_NUMBER(TRIM(MCR.ATTRIBUTE7))
          ELSE NULL
        END AS urut,
        ROUND(inv_convert.inv_um_convert(MCR.INVENTORY_ITEM_ID, 'DUS', 'BAL'), 6) DUS_BAL,
        ROUND(inv_convert.inv_um_convert(MCR.INVENTORY_ITEM_ID, 'BAL', 'PRS'), 6) BAL_PRS,
        ROUND(inv_convert.inv_um_convert(MCR.INVENTORY_ITEM_ID, 'PRS', 'BKS'), 6) PRS_BKS,
        ROUND(inv_convert.inv_um_convert(MCR.INVENTORY_ITEM_ID, 'BKS', 'BTG'), 6) BKS_BTG
      FROM mtl_cross_references_v mcr, mtl_system_items_b mtls
      WHERE mcr.INVENTORY_ITEM_ID = mtls.INVENTORY_ITEM_ID
        AND mtls.inventory_item_status_code = 'Active'
      ORDER BY ITEM_CODE
    ) csi ON csi.INVENTORY_ITEM_ID = si.INVENTORY_ITEM_ID
  `;

  private roundConversion(value: unknown): number | undefined {
    if (value == null || value === '') {
      return undefined;
    }

    const n = Number(value);
    if (Number.isNaN(n)) {
      return undefined;
    }

    // Strip IEEE-754 artifacts from Oracle NUMBER -> JS Number conversion.
    return Math.round(n * 1e6) / 1e6;
  }

  private mapRowToItemListDto(row: Record<string, any>): MetaItemListDto {
    return {
      item_code: row.ITEM_CODE,
      item_number: row.ITEM_NUMBER,
      item_description: row.ITEM_DESCRIPTION,
      inventory_item_id: row.INVENTORY_ITEM_ID,
      organization_code: row.ORGANIZATION_CODE,
      principle: row.PRINCIPLE,
      status_code: row.STATUS_CODE,
      urut: this.roundConversion(row.URUT),
      dus_bal: this.roundConversion(row.DUS_BAL),
      bal_prs: this.roundConversion(row.BAL_PRS),
      prs_bks: this.roundConversion(row.PRS_BKS),
      bks_btg: this.roundConversion(row.BKS_BTG),
    };
  }

  async getItemListFromOracleByItemCode(
    params?: MetaItemListDtoByItemCode,
  ): Promise<MetaItemListResponseDto> {
    const item_code = params?.item_code;

    const cacheKey = item_code
      ? `item_list:${this.CACHE_VERSION}:item_code:${item_code}`
      : `item_list:${this.CACHE_VERSION}:all`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaItemListResponseDto;
      }
      this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
    } catch (error) {
      this.logger.error(
        `Error accessing Redis cache: ${error.message}`,
        error.stack,
      );
    }

    try {
      let query = `
        SELECT
          si.ITEM_CODE,
          si.ITEM_NUMBER,
          si.ITEM_DESCRIPTION,
          si.INVENTORY_ITEM_ID,
          csi.Principle AS PRINCIPLE,
          csi.status_code AS STATUS_CODE,
          csi.urut AS URUT,
          csi.DUS_BAL,
          csi.BAL_PRS,
          csi.PRS_BKS,
          csi.BKS_BTG
        FROM (
          SELECT ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID
          FROM XTD_INV_SALES_ITEMS_V
          GROUP BY ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID
          ORDER BY ITEM_CODE
        ) si
        ${this.conversionJoinSql}
        WHERE 1=1
      `;

      const queryParams = [];
      if (item_code) {
        query += ` AND si.ITEM_CODE = :item_code`;
        queryParams.push(item_code);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      const itemList: MetaItemListDto[] = result.rows.map((row) =>
        this.mapRowToItemListDto(row),
      );

      const response: MetaItemListResponseDto = {
        data: itemList,
        count: itemList.length,
        status: true,
        message: 'Item list data retrieved successfully from Oracle',
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
      }

      return response;
    } catch (error) {
      this.logger.error(
        `Error in getItemListFromOracleByItemCode: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving sales items data: ${error.message}`,
      };
    }
  }

  async getItemListByInventoryItemIdAndOrgCode(
    params: MetaItemListDtoByInventoryItemId,
  ): Promise<MetaItemListResponseDto> {
    const { inventory_item_id, organization_code } = params;

    try {
      const query = `
        SELECT
          si.ITEM_CODE,
          si.ITEM_NUMBER,
          si.ITEM_DESCRIPTION,
          si.INVENTORY_ITEM_ID,
          si.ORGANIZATION_CODE,
          csi.Principle AS PRINCIPLE,
          csi.status_code AS STATUS_CODE,
          csi.urut AS URUT,
          csi.DUS_BAL,
          csi.BAL_PRS,
          csi.PRS_BKS,
          csi.BKS_BTG
        FROM XTD_INV_SALES_ITEMS_V si
        ${this.conversionJoinSql}
        WHERE si.INVENTORY_ITEM_ID = :inventory_item_id
          AND si.ORGANIZATION_CODE = :organization_code
      `;

      const result = await this.oracleService.executeQuery(query, [
        Number(inventory_item_id),
        String(organization_code),
      ]);

      const itemList: MetaItemListDto[] = result.rows.map((row) =>
        this.mapRowToItemListDto(row),
      );

      const response: MetaItemListResponseDto = {
        data: itemList,
        count: itemList.length,
        status: true,
        message:
          'Item list data retrieved successfully by inventory_item_id and organization_code',
      };

      return response;
    } catch (error) {
      this.logger.error(
        `Error in getItemListByInventoryItemIdAndOrgCode: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving item list data: ${error.message}`,
      };
    }
  }

  async findAllItemLists(params: ItemListQueryDto): Promise<MetaItemListResponseDto> {
    this.logger.log('==== MICROSERVICE: Find all item lists ====');

    const cacheKey = `item_list:${this.CACHE_VERSION}:findAll`;

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaItemListResponseDto;
      }
    } catch (error) {
      this.logger.error(`Error accessing Redis cache: ${error.message}`);
    }

    try {
      let query = `
        SELECT
          si.ITEM_CODE,
          si.ITEM_NUMBER,
          si.ITEM_DESCRIPTION,
          si.INVENTORY_ITEM_ID,
          csi.Principle AS PRINCIPLE,
          csi.status_code AS STATUS_CODE,
          csi.urut AS URUT,
          csi.DUS_BAL,
          csi.BAL_PRS,
          csi.PRS_BKS,
          csi.BKS_BTG
        FROM (
          SELECT ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID
          FROM XTD_INV_SALES_ITEMS_V
          GROUP BY ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID
          ORDER BY ITEM_CODE
        ) si
        ${this.conversionJoinSql}
        WHERE 1=1
      `;
      const queryParams: any[] = [];

      if (params.search) {
        query += ` AND UPPER(si.ITEM_DESCRIPTION) LIKE UPPER(?)`;
        queryParams.push(`%${params.search}%`);
      }

      query += ` ORDER BY si.ITEM_CODE`;

      if (params.limit) {
        const offset = ((params.page || 1) - 1) * params.limit;
        query += ` OFFSET ${offset} ROWS FETCH NEXT ${params.limit} ROWS ONLY`;
      }

      const result = await this.oracleService.executeQuery(query, queryParams);
      const data: MetaItemListDto[] = result.rows.map((row) =>
        this.mapRowToItemListDto(row),
      );

      const response: MetaItemListResponseDto = {
        data,
        count: data.length,
        status: true,
        message: 'Item lists retrieved successfully',
      };

      try {
        await this.redisService.set(cacheKey, JSON.stringify(response), this.CACHE_TTL);
      } catch (cacheError) {
        this.logger.error(`Error storing data in Redis: ${cacheError.message}`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Error in findAllItemLists: ${error.message}`, error.stack);
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving item lists: ${error.message}`,
      };
    }
  }

  async countItemLists(params: ItemListQueryDto): Promise<{ count: number; status: boolean; message?: string }> {
    this.logger.log('==== MICROSERVICE: Count item lists ====');

    const cacheKey = `item_list:count:search:${params.search || 'all'}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string);
      }
    } catch (error) {
      this.logger.error(`Error accessing Redis cache: ${error.message}`);
    }

    try {
      let query = `SELECT COUNT(*) as count FROM XTD_INV_SALES_ITEMS_V`;
      const queryParams: any[] = [];

      if (params.search) {
        query += ` WHERE UPPER(ITEM_DESCRIPTION) LIKE UPPER(?)`;
        queryParams.push(`%${params.search}%`);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);
      const count = result.rows[0]?.count || 0;

      const response = {
        count,
        status: true,
        message: 'Item lists count retrieved successfully',
      };

      try {
        await this.redisService.set(cacheKey, JSON.stringify(response), this.CACHE_TTL);
      } catch (cacheError) {
        this.logger.error(`Error storing count in Redis: ${cacheError.message}`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Error in countItemLists: ${error.message}`, error.stack);
      return {
        count: 0,
        status: false,
        message: `Error counting item lists: ${error.message}`,
      };
    }
  }
}
