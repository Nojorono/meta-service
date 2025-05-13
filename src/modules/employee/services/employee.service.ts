import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { EmployeeMetaResponseDto } from '../dtos/employee.dtos';
import { EmployeeMetaDtoByDate } from '../dtos/employee.dtos';
import { EmployeeMetaDtoByEmployeeNumber } from '../dtos/employee.dtos';
import { EmployeeMetaDto } from '../dtos/employee.dtos';

@Injectable()
export class EmployeeMetaService {
  private readonly logger = new Logger(EmployeeMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getEmployeeFromOracleByEmployeeNumber(
    params?: EmployeeMetaDtoByEmployeeNumber,
  ): Promise<EmployeeMetaResponseDto> {
    // Set default values if not provided
    const employee_number = params;

    this.logger.log('params' + params);

    // Generate unique cache key based on parameters
    const cacheKey = employee_number
      ? `employee:employee_number:${employee_number}`
      : `employee:employee_number:${employee_number}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as EmployeeMetaResponseDto;
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
        SELECT * FROM APPS.XTD_PAPF_EMPLOYEE_V
        WHERE 1=1
      `;

      // Add search condition if search term is provided
      const queryParams = [];
      if (employee_number) {
        query += ` AND EMPLOYEE_NUMBER = :employee_number`;
        queryParams.push(employee_number);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      // Transform Oracle result to DTO format
      const employees: EmployeeMetaDto[] = result.rows.map((row) => ({
        employee_number: row.EMPLOYEE_NUMBER,
        employee_name: row.EMPLOYEE_NAME,
        flag_salesman: row.FLAG_SALESMAN,
        supervisor_number: row.SUPERVISOR_NUMBER,
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
        effective_start_date: row.EFFECTIVE_START_DATE,
        effective_end_date: row.EFFECTIVE_END_DATE,
      }));

      // Prepare response
      const response: EmployeeMetaResponseDto = {
        data: employees,
        count: employees.length,
        status: true,
        message: 'Employee data retrieved successfully from Oracle',
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

  async getEmployeeFromOracleByDate(
    params?: EmployeeMetaDtoByDate,
  ): Promise<EmployeeMetaResponseDto> {
    // Set default values if not provided
    const last_update_date = params;

    this.logger.log('params' + params);

    // Generate unique cache key based on parameters
    const cacheKey = last_update_date
      ? `employee:last_update_date:${last_update_date}`
      : `employee:last_update_date:${last_update_date}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as EmployeeMetaResponseDto;
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
      const query = `
        SELECT * FROM APPS.XTD_ONT_SALESREPS_V
        WHERE 1=1
      `;

      // Add search condition if search term is provided
      // const queryParams = [];
      // if (last_update_date) {
      //   query += ` AND LAST_UPDATE_DATE >= TO_DATE(:last_update_date, 'YYYY-MM-DD') AND LAST_UPDATE_DATE < TO_DATE(:last_update_date, 'YYYY-MM-DD') + 1`;
      //   queryParams.push(last_update_date, last_update_date);
      // }

      const result = await this.oracleService.executeQuery(query);

      // Transform Oracle result to DTO format
      const employees: EmployeeMetaDto[] = result.rows.map((row) => ({
        employee_number: row.EMPLOYEE_NUMBER,
        employee_name: row.EMPLOYEE_NAME,
        flag_salesman: row.FLAG_SALESMAN,
        supervisor_number: row.SUPERVISOR_NUMBER,
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
        effective_start_date: row.EFFECTIVE_START_DATE,
        effective_end_date: row.EFFECTIVE_END_DATE,
      }));

      // Prepare response
      const response: EmployeeMetaResponseDto = {
        data: employees,
        count: employees.length,
        status: true,
        message: 'Employee data retrieved successfully from Oracle',
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
        message: `Error retrieving employee data: ${error.message}`,
      };
    }
  }
  /**
   * Invalidates employee-related caches
   * @param employee_number Optional employee number to invalidate specific employee cache
   */
  async invalidateEmployeeCache(employee_number?: string): Promise<void> {
    try {
      if (employee_number) {
        // Invalidate specific employee cache
        const cacheKey = `employee:number:${employee_number}`;
        await this.redisService.delete(cacheKey);
        this.logger.log(
          `Invalidated cache for employee number ${employee_number}`,
        );
      }

      // Invalidate all employee list cache entries
      await this.redisService.deleteByPattern('employee:page:*');
      this.logger.log('Invalidated all employee list caches');
    } catch (error) {
      this.logger.error(
        `Error invalidating cache: ${error.message}`,
        error.stack,
      );
    }
  }
}
