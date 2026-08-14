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

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) { }

  async getItemListFromOracleByItemCode(
    params?: MetaItemListDtoByItemCode,
  ): Promise<MetaItemListResponseDto> {
    const item_code = params?.item_code;

    const cacheKey = item_code
      ? `item_list:item_code:${item_code}`
      : 'item_list:all';

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
        SELECT 	* FROM 
          (SELECT ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID
                FROM XTD_INV_SALES_ITEMS_V 
                GROUP BY ITEM_CODE,ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID 
                ORDER BY ITEM_CODE) si
                LEFT JOIN (select 
              DISTINCT 
                (SELECT MAX (CATEGORY_CONCAT_SEGS)
                        FROM MTL_ITEM_CATEGORIES_V
                      WHERE     1 = 1
                            AND INVENTORY_ITEM_ID = mcr.INVENTORY_ITEM_ID
                            AND CATEGORY_SET_NAME = 'Principal Category') Principle,
              mcr.INVENTORY_ITEM_ID,
              MCR.ATTRIBUTE6, 
              mtls.inventory_item_status_code status_code,
              to_number(MCR.ATTRIBUTE7) as urut,
              inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'DUS','BAL') DUS_BAL,
              inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'BAL','PRS') BAL_PRS,
              inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'PRS','BKS') PRS_BKS, 
              inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'BKS','BTG') BKS_BTG
              FROM mtl_cross_references_v mcr, mtl_system_items_b mtls
              where mcr.INVENTORY_ITEM_ID = mtls.INVENTORY_ITEM_ID
              AND mtls.inventory_item_status_code ='Active'
              ORDER BY ITEM_CODE) csi ON csi.INVENTORY_ITEM_ID = si.INVENTORY_ITEM_ID  
        WHERE 1=1
      `;

      const queryParams = [];
      if (item_code) {
        query += ` AND si.ITEM_CODE = :item_code`;
        queryParams.push(item_code);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      const itemList: MetaItemListDto[] = result.rows.map((row) => ({
        item_code: row.ITEM_CODE,
        item_number: row.ITEM_NUMBER,
        item_description: row.ITEM_DESCRIPTION,
        inventory_item_id: row.INVENTORY_ITEM_ID,
      }));

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
         *
        FROM XTD_INV_SALES_ITEMS_V si
        LEFT JOIN (select 
          DISTINCT 
            (SELECT MAX (CATEGORY_CONCAT_SEGS)
                    FROM MTL_ITEM_CATEGORIES_V
                  WHERE     1 = 1
                        AND INVENTORY_ITEM_ID = mcr.INVENTORY_ITEM_ID
                        AND CATEGORY_SET_NAME = 'Principal Category') Principle,
          mcr.INVENTORY_ITEM_ID,
          MCR.ATTRIBUTE6, 
          mtls.inventory_item_status_code status_code,
          to_number(MCR.ATTRIBUTE7) as urut,
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'DUS','BAL') DUS_BAL,
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'BAL','PRS') BAL_PRS,
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'PRS','BKS') PRS_BKS, 
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'BKS','BTG') BKS_BTG
          FROM mtl_cross_references_v mcr, mtl_system_items_b mtls
          where mcr.INVENTORY_ITEM_ID = mtls.INVENTORY_ITEM_ID
          AND mtls.inventory_item_status_code ='Active'
          ORDER BY ITEM_CODE) csi ON csi.INVENTORY_ITEM_ID = si.INVENTORY_ITEM_ID  
        WHERE si.INVENTORY_ITEM_ID = :inventory_item_id
        AND si.ORGANIZATION_CODE = :organization_code
      `;

      const result = await this.oracleService.executeQuery(query, [
        Number(inventory_item_id),
        String(organization_code),
      ]);

      const itemList: MetaItemListDto[] = result.rows.map((row) => ({
        item_code: row.ITEM_CODE,
        item_number: row.ITEM_NUMBER,
        item_description: row.ITEM_DESCRIPTION,
        inventory_item_id: row.INVENTORY_ITEM_ID,
        organization_code: row.ORGANIZATION_CODE,
      }));

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

    const cacheKey = `item_list:findAll`;

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
        SELECT * FROM 
        (SELECT ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID  
        FROM XTD_INV_SALES_ITEMS_V
        GROUP BY ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID 
        ORDER BY ITEM_CODE) si
        LEFT JOIN (select 
          DISTINCT 
            (SELECT MAX (CATEGORY_CONCAT_SEGS)
                    FROM MTL_ITEM_CATEGORIES_V
                  WHERE     1 = 1
                        AND INVENTORY_ITEM_ID = mcr.INVENTORY_ITEM_ID
                        AND CATEGORY_SET_NAME = 'Principal Category') Principle,
          mcr.INVENTORY_ITEM_ID,
          MCR.ATTRIBUTE6, 
          mtls.inventory_item_status_code status_code,
          to_number(MCR.ATTRIBUTE7) as urut,
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'DUS','BAL') DUS_BAL,
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'BAL','PRS') BAL_PRS,
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'PRS','BKS') PRS_BKS, 
          inv_convert.inv_um_convert (MCR.INVENTORY_ITEM_ID,'BKS','BTG') BKS_BTG
          FROM mtl_cross_references_v mcr, mtl_system_items_b mtls
          where mcr.INVENTORY_ITEM_ID = mtls.INVENTORY_ITEM_ID
          AND mtls.inventory_item_status_code ='Active'
          ORDER BY ITEM_CODE) csi ON csi.INVENTORY_ITEM_ID = si.INVENTORY_ITEM_ID
        WHERE 1=1
      `;
      const queryParams: any[] = [];

      if (params.search) {
        query += ` WHERE UPPER(si.ITEM_DESCRIPTION) LIKE UPPER(?)`;
        queryParams.push(`%${params.search}%`);
      }

      query += ` ORDER BY si.ITEM_CODE`;

      if (params.limit) {
        const offset = ((params.page || 1) - 1) * params.limit;
        query += ` OFFSET ${offset} ROWS FETCH NEXT ${params.limit} ROWS ONLY`;
      }

      const result = await this.oracleService.executeQuery(query, queryParams);
      const data = result.rows as MetaItemListDto[];

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
