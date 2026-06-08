import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import {
  MetaSalesmanDtoByDate,
  MetaSalesmanDtoBySalesrepNumber,
  MetaSalesmanResponseDto,
} from '../dtos/salesman.dtos';

@Injectable()
export class SalesmanMetaService {
  private readonly logger = new Logger(SalesmanMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) { }

  async getSalesmenFromOracleByDate(
    params?: MetaSalesmanDtoByDate,
  ): Promise<MetaSalesmanResponseDto> {
    const last_update_date = params?.last_update_date;

    const cacheKey = last_update_date
      ? `salesmen:last_update_date:${last_update_date}`
      : 'salesmen:all';

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaSalesmanResponseDto;
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
        SELECT * FROM APPS.XTD_ONT_SALESREPS_V
        WHERE 1=1
      `;

      const queryParams = [];
      if (last_update_date) {
        query += ` AND LAST_UPDATE_DATE >= TO_DATE(:last_update_date, 'YYYY-MM-DD')`;
        queryParams.push(last_update_date);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      const salesmen = result.rows.map((row) => this.mapSalesmanRow(row));

      const response: MetaSalesmanResponseDto = {
        data: salesmen,
        count: salesmen.length,
        status: true,
        message: 'Salesman data retrieved successfully from Oracle',
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
        `Error in getSalesmenFromOracleByDate: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving salesman data: ${error.message}`,
      };
    }
  }

  async getSalesmanBySalesrepNumber(
    params: MetaSalesmanDtoBySalesrepNumber,
  ): Promise<MetaSalesmanResponseDto> {
    const salesrepNumber = params?.salesrep_number?.trim();

    if (!salesrepNumber) {
      return {
        data: [],
        count: 0,
        status: false,
        message: 'salesrep_number is required',
      };
    }

    try {
      const query = `
        SELECT * FROM APPS.XTD_ONT_SALESREPS_V
        WHERE UPPER(SALESREP_NUMBER) = UPPER(:salesrep_number)
      `;

      const result = await this.oracleService.executeQuery(query, [
        salesrepNumber,
      ]);

      const salesmen = result.rows.map((row) => this.mapSalesmanRow(row));

      const response: MetaSalesmanResponseDto = {
        data: salesmen,
        count: salesmen.length,
        status: salesmen.length > 0,
        message:
          salesmen.length > 0
            ? 'Salesman data retrieved successfully from Oracle'
            : `No salesman found for salesrep_number ${salesrepNumber}`,
      };

      return response;
    } catch (error) {
      this.logger.error(
        `Error in getSalesmanBySalesrepNumber: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving salesman data: ${error.message}`,
      };
    }
  }

  private mapSalesmanRow(row: Record<string, any>): Record<string, any> {
    return { ...row };
  }
}
