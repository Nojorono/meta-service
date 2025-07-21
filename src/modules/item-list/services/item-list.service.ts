import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import {
  MetaItemListDto,
  MetaItemListDtoByItemCode,
  MetaItemListResponseDto,
} from '../dtos/item-list.dtos';

@Injectable()
export class ItemListMetaService {
  private readonly logger = new Logger(ItemListMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getItemListFromOracleByItemCode(
    params?: MetaItemListDtoByItemCode,
  ): Promise<MetaItemListResponseDto> {
    const item_code = params?.item_code;

    const cacheKey = item_code
      ? `sales-items:item_code:${item_code}`
      : 'sales-items:all';

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
        SELECT * FROM 
        (SELECT ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID  
        FROM XTD_INV_SALES_ITEMS_V
        GROUP BY ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID 
        ORDER BY ITEM_CODE)
        WHERE 1=1
      `;

      const queryParams = [];
      if (item_code) {
        query += ` AND ITEM_CODE = :item_code`;
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
}
