import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { MetaSalesItemDto, MetaSalesItemDtoByDate, MetaSalesItemResponseDto } from '../dtos/sales-item.dtos';

@Injectable()
export class SalesItemMetaService {
  private readonly logger = new Logger(SalesItemMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getSalesItemsFromOracleByDate(
    params?: MetaSalesItemDtoByDate,
  ): Promise<MetaSalesItemResponseDto> {
    const last_update_date = params?.last_update_date;

    const cacheKey = last_update_date
      ? `sales-items:last_update_date:${last_update_date}`
      : 'sales-items:all';

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaSalesItemResponseDto;
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
        SELECT * FROM APPS.XTD_INV_SALES_ITEMS_V
        WHERE 1=1
      `;

      const queryParams = [];
      if (last_update_date) {
        query += ` AND LAST_UPDATE_DATE >= TO_DATE(:last_update_date, 'YYYY-MM-DD')`;
        queryParams.push(last_update_date);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      const salesItems: MetaSalesItemDto[] = result.rows.map((row) => ({
        item_id: row.ITEM_ID,
        item_code: row.ITEM_CODE,
        item_name: row.ITEM_NAME,
        organization_id: row.ORGANIZATION_ID,
        organization_code: row.ORGANIZATION_CODE,
        primary_unit_of_measure: row.PRIMARY_UNIT_OF_MEASURE,
        item_type: row.ITEM_TYPE,
        planning_make_buy_code: row.PLANNING_MAKE_BUY_CODE,
        is_active: row.IS_ACTIVE,
        last_update_date: row.LAST_UPDATE_DATE,
      }));

      const response: MetaSalesItemResponseDto = {
        data: salesItems,
        count: salesItems.length,
        status: true,
        message: 'Sales items data retrieved successfully from Oracle',
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
        `Error in getSalesItemsFromOracleByDate: ${error.message}`,
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
