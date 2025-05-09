import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { SalesmanMetaResponseDto } from '../dtos/salesmas.dtos';
import { SalesmanMetaDtoByDate } from '../dtos/salesmas.dtos';
import { SalesmanMetaDtoBySalesrepNumber } from '../dtos/salesmas.dtos';
import { SalesmanMetaDto } from '../dtos/salesmas.dtos';

@Injectable()
export class SalesmanMetaService {
  private readonly logger = new Logger(SalesmanMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getSalesmanFromOracleBySalesrepNumber(
    params?: SalesmanMetaDtoBySalesrepNumber,
  ): Promise<SalesmanMetaResponseDto> {
    // Set default values if not provided
    const salesrep_number = params;

    this.logger.log('params' + params);

    // Generate unique cache key based on parameters
    // const cacheKey = salesrep_number
    //   ? `salesman:salesrep_number:${salesrep_number}`
    //   : `salesman:salesrep_number:${salesrep_number}`;

    // // Try to get data from cache first
    // try {
    //   const cachedData = await this.redisService.get(cacheKey);
    //   if (cachedData) {
    //     this.logger.log(`Cache hit for ${cacheKey}`);
    //     return JSON.parse(cachedData as string) as SalesmanMetaResponseDto;
    //   }
    //   this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
    // } catch (error) {
    //   this.logger.error(
    //     `Error accessing Redis cache: ${error.message}`,
    //     error.stack,
    //   );
    //   // Continue with database query if cache access fails
    // }

    try {
      // Using uppercase for object names since Oracle typically stores them in uppercase
      let query = `
        SELECT * FROM APPS.XTD_ONT_SALESREPS_V
        WHERE 1=1
      `;

      // Add search condition if search term is provided
      const queryParams = [];
      if (salesrep_number) {
        query += ` AND SALESREP_NUMBER = :salesrep_number`;
        queryParams.push(salesrep_number);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      // Transform Oracle result to DTO format
      const salesmen: SalesmanMetaDto[] = result.rows.map((row) => ({
        salesrep_number: row.SALESREP_NUMBER,
        salesrep_name: row.SALESREP_NAME,
        employee_name: row.EMPLOYEE_NAME,
        supervisor_number: row.SUPERVISOR_NUMBER,
        salesrep_id: row.SALESREP_ID,
        sales_credit_type_id: row.SALES_CREDIT_TYPE_ID,
        subinventory_code: row.SUBINVENTORY_CODE,
        locator_id: row.LOCATOR_ID,
        vendor_name: row.VENDOR_NAME,
        vendor_num: row.VENDOR_NUM,
        vendor_site_code: row.VENDOR_SITE_CODE,
        vendor_id: row.VENDOR_ID,
        vendor_site_id: row.VENDOR_SITE_ID,
        organization_code: row.ORGANIZATION_CODE,
        organization_name: row.ORGANIZATION_NAME,
        organization_id: row.ORGANIZATION_ID,
        org_name: row.ORG_NAME,
        org_id: row.ORG_ID,
        status: row.STATUS,
        start_date_active: row.START_DATE_ACTIVE,
        end_date_active: row.END_DATE_ACTIVE,
      }));

      // Prepare response
      const response: SalesmanMetaResponseDto = {
        data: salesmen,
        count: salesmen.length,
        status: true,
        message: 'Salesman data retrieved successfully from Oracle',
      };

      // // Store in Redis cache
      // try {
      //   await this.redisService.set(
      //     cacheKey,
      //     JSON.stringify(response),
      //     this.CACHE_TTL,
      //   );
      //   this.logger.log(`Data stored in cache with key ${cacheKey}`);
      // } catch (cacheError) {
      //   this.logger.error(
      //     `Error storing data in Redis: ${cacheError.message}`,
      //     cacheError.stack,
      //   );
      //   // Continue even if cache storage fails
      // }

      return response;
    } catch (error) {
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving salesman data: ${error.message}`,
      };
    }
  }

  async getSalesmanFromOracleByDate(
    params?: SalesmanMetaDtoByDate,
  ): Promise<SalesmanMetaResponseDto> {
    // Set default values if not provided
    const last_update_date = params;

    this.logger.log('params' + params);

    // Generate unique cache key based on parameters
    const cacheKey = last_update_date
      ? `salesman:last_update_date:${last_update_date}`
      : `salesman:last_update_date:${last_update_date}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as SalesmanMetaResponseDto;
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
      // Using uppercase for object names since Oracle typically stores them in uppercase
      let query = `
        SELECT * FROM APPS.XTD_ONT_SALESREPS_V
        WHERE 1=1
      `;

      // Add search condition if search term is provided
      const queryParams = [];
      if (last_update_date) {
        query += ` AND LAST_UPDATE_DATE >= TO_DATE(:last_update_date, 'YYYY-MM-DD') AND LAST_UPDATE_DATE < TO_DATE(:last_update_date, 'YYYY-MM-DD') + 1`;
        queryParams.push(last_update_date, last_update_date);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      // Transform Oracle result to DTO format
      const salesmen: SalesmanMetaDto[] = result.rows.map((row) => ({
        salesrep_number: row.SALESREP_NUMBER,
        salesrep_name: row.SALESREP_NAME,
        employee_name: row.EMPLOYEE_NAME,
        supervisor_number: row.SUPERVISOR_NUMBER,
        salesrep_id: row.SALESREP_ID,
        sales_credit_type_id: row.SALES_CREDIT_TYPE_ID,
        subinventory_code: row.SUBINVENTORY_CODE,
        locator_id: row.LOCATOR_ID,
        vendor_name: row.VENDOR_NAME,
        vendor_num: row.VENDOR_NUM,
        vendor_site_code: row.VENDOR_SITE_CODE,
        vendor_id: row.VENDOR_ID,
        vendor_site_id: row.VENDOR_SITE_ID,
        organization_code: row.ORGANIZATION_CODE,
        organization_name: row.ORGANIZATION_NAME,
        organization_id: row.ORGANIZATION_ID,
        org_name: row.ORG_NAME,
        org_id: row.ORG_ID,
        status: row.STATUS,
        start_date_active: row.START_DATE_ACTIVE,
        end_date_active: row.END_DATE_ACTIVE,
      }));

      // Prepare response
      const response: SalesmanMetaResponseDto = {
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
        // Continue even if cache storage fails
      }

      return response;
    } catch (error) {
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving salesman data: ${error.message}`,
      };
    }
  }
  /**
   * Invalidates salesman-related caches
   * @param salesman_number Optional salesman number to invalidate specific salesman cache
   */
  async invalidateSalesmanCache(salesman_number?: string): Promise<void> {
    try {
      if (salesman_number) {
        // Invalidate specific salesman cache
        const cacheKey = `salesman:number:${salesman_number}`;
        await this.redisService.delete(cacheKey);
        this.logger.log(
          `Invalidated cache for salesman number ${salesman_number}`,
        );
      }

      // Invalidate all salesman list cache entries
      await this.redisService.deleteByPattern('salesman:page:*');
      this.logger.log('Invalidated all salesman list caches');
    } catch (error) {
      this.logger.error(
        `Error invalidating cache: ${error.message}`,
        error.stack,
      );
    }
  }
}
