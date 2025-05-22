import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { EmployeeMetaResponseDto } from '../dtos/employee.dtos';
import { EmployeeMetaDtoByDate } from '../dtos/employee.dtos';
import { EmployeeMetaDtoByEmployeeNumber } from '../dtos/employee.dtos';
import { EmployeeMetaDto } from '../dtos/employee.dtos';
import { EmployeeHrisDto } from '../dtos/employee.hris.dto';
import * as oracledb from 'oracledb';

@Injectable()
export class EmployeeMetaService {
  private readonly logger = new Logger(EmployeeMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async postEmployeeHris(params?: EmployeeHrisDto): Promise<any> {
    // Set default values if not provided

    this.logger.log('params' + params);

    try {
      // Using uppercase for object names since Oracle typically stores them in uppercase
      const query = `
                  INSERT INTO APPS.xtd_hr_employee_stg (
                    SOURCE,
                    HRIS_HEADER_ID,
                    TRX_TYPE,
                    HEADER_ID,
                    COMPANY_ID,
                    COST_CENTER,
                    EMPLOYEE_ID,
                    EMPLOYEE_NAME,
                    NATURAL_ACCOUNT,
                    ABSENCE_CARD_NO,
                    JOIN_DATE,
                    TERMINATE_DATE,
                    ORG_ID,
                    ORG_NAME,
                    POSITION_ID,
                    POSITION_TITLE,
                    POSITION_LEVEL,
                    POSITION_GROUP,
                    SALES_FLAG,
                    LOCATION_CODE,
                    COMPANY_OFFICE,
                    WORK_LOCATION,
                    GENDER,
                    EMAIL,
                    SPV_COMPANY_ID,
                    SPV_ID,
                    SPV_NAME,
                    SPV_POSITION_ID,
                    SPV_POSITION_NAME,
                    BANK_CODE,
                    BRANCH_NAME,
                    ACCOUNT_NO,
                    ACCOUNT_NAME,
                    IMPORT_STATUS,
                    MESSAGE,
                    META_PERSON_ID,
                    META_VENDOR_ID,
                    META_SALES_ID,
                    META_LOCATOR_ID,
                    ATTRIBUTE1,
                    ATTRIBUTE2,
                    ATTRIBUTE3,
                    ATTRIBUTE4,
                    ATTRIBUTE5,
                    ATTRIBUTE6,
                    ATTRIBUTE7,
                    ATTRIBUTE8,
                    ATTRIBUTE9,
                    ATTRIBUTE10,
                    ATTRIBUTE11,
                    ATTRIBUTE12,
                    ATTRIBUTE13,
                    ATTRIBUTE14,
                    ATTRIBUTE15,
                    SOURCE_SYSTEM,
                    SOURCE_BATCH_ID,
                    SOURCE_HEADER_ID,
                    SOURCE_LINE_ID,
                    CREATION_DATE,
                    CREATED_BY,
                    LAST_UPDATE_LOGIN,
                    LAST_UPDATE_DATE,
                    LAST_UPDATED_BY
                  ) VALUES (
                    :SOURCE,
                    :HRIS_HEADER_ID,
                    :TRX_TYPE,
                    :HEADER_ID,
                    :COMPANY_ID,
                    :COST_CENTER,
                    :EMPLOYEE_ID,
                    :EMPLOYEE_NAME,
                    :NATURAL_ACCOUNT,
                    :ABSENCE_CARD_NO,
                    :JOIN_DATE,
                    :TERMINATE_DATE,
                    :ORG_ID,
                    :ORG_NAME,
                    :POSITION_ID,
                    :POSITION_TITLE,
                    :POSITION_LEVEL,
                    :POSITION_GROUP,
                    :SALES_FLAG,
                    :LOCATION_CODE,
                    :COMPANY_OFFICE,
                    :WORK_LOCATION,
                    :GENDER,
                    :EMAIL,
                    :SPV_COMPANY_ID,
                    :SPV_ID,
                    :SPV_NAME,
                    :SPV_POSITION_ID,
                    :SPV_POSITION_NAME,
                    :BANK_CODE,
                    :BRANCH_NAME,
                    :ACCOUNT_NO,
                    :ACCOUNT_NAME,
                    :IMPORT_STATUS,
                    :MESSAGE,
                    :META_PERSON_ID,
                    :META_VENDOR_ID,
                    :META_SALES_ID,
                    :META_LOCATOR_ID,
                    :ATTRIBUTE1,
                    :ATTRIBUTE2,
                    :ATTRIBUTE3,
                    :ATTRIBUTE4,
                    :ATTRIBUTE5,
                    :ATTRIBUTE6,
                    :ATTRIBUTE7,
                    :ATTRIBUTE8,
                    :ATTRIBUTE9,
                    :ATTRIBUTE10,
                    :ATTRIBUTE11,
                    :ATTRIBUTE12,
                    :ATTRIBUTE13,
                    :ATTRIBUTE14,
                    :ATTRIBUTE15,
                    :SOURCE_SYSTEM,
                    :SOURCE_BATCH_ID,
                    :SOURCE_HEADER_ID,
                    :SOURCE_LINE_ID,
                    SYSDATE,
                    :CREATED_BY,
                    :LAST_UPDATE_LOGIN,
                    SYSDATE,
                    :LAST_UPDATED_BY
                  )
                  RETURNING HEADER_ID INTO :headerId
                `;

      // Create an object with all required bind variables and their default values
      const allBindVars = {
        SOURCE: 'HRIS',
        COMPANY_ID: 'NNA',
        EMPLOYEE_ID: params.EMPLOYEE_ID || '',
        EMPLOYEE_NAME: params.EMPLOYEE_NAME || '',
        NATURAL_ACCOUNT: '61',
        ABSENCE_CARD_NO: params.EMPLOYEE_ID || '',
        JOIN_DATE: params.JOIN_DATE ? new Date(params.JOIN_DATE) : new Date(),
        ORG_NAME: params.ORG_NAME || 'SALES',
        ORG_ID: params.ORG_ID || '',
        POSITION_TITLE: params.POSITION_TITLE || 'SALES RRO',
        POSITION_LEVEL: params.POSITION_LEVEL || 'STAFF',
        EMAIL: params.EMAIL || '',
        ATTRIBUTE15: 'TSF',
        LOCATION_CODE: params.LOCATION_CODE || '',
        COMPANY_OFFICE: params.COMPANY_OFFICE || '',
        WORK_LOCATION: params.WORK_LOCATION || '',
        GENDER: params.GENDER || 'MALE',
        CREATED_BY: 'DMS',
        LAST_UPDATED_BY: 'DMS',
        // Default null for all other fields
        HRIS_HEADER_ID: null,
        TRX_TYPE: null,
        HEADER_ID: null,
        COST_CENTER: null,
        TERMINATE_DATE: null,
        POSITION_ID: null,
        POSITION_GROUP: null,
        SALES_FLAG: 'Y',
        SPV_COMPANY_ID: null,
        SPV_ID: null,
        SPV_NAME: null,
        SPV_POSITION_ID: null,
        SPV_POSITION_NAME: null,
        BANK_CODE: null,
        BRANCH_NAME: null,
        ACCOUNT_NO: null,
        ACCOUNT_NAME: null,
        IMPORT_STATUS: null,
        MESSAGE: null,
        META_PERSON_ID: null,
        META_VENDOR_ID: null,
        META_SALES_ID: null,
        META_LOCATOR_ID: null,
        ATTRIBUTE1: null,
        ATTRIBUTE2: null,
        ATTRIBUTE3: null,
        ATTRIBUTE4: null,
        ATTRIBUTE5: null,
        ATTRIBUTE6: null,
        ATTRIBUTE7: null,
        ATTRIBUTE8: null,
        ATTRIBUTE9: null,
        ATTRIBUTE10: null,
        ATTRIBUTE11: null,
        ATTRIBUTE12: null,
        ATTRIBUTE13: null,
        ATTRIBUTE14: null,
        SOURCE_SYSTEM: null,
        SOURCE_BATCH_ID: null,
        SOURCE_HEADER_ID: null,
        SOURCE_LINE_ID: null,
        LAST_UPDATE_LOGIN: null,
        // Override with current date for audit fields
        CREATION_DATE: new Date(),
        LAST_UPDATE_DATE: new Date(),
      };

      // Convert to array of bind variables
      const bindValues = [
        allBindVars.SOURCE,
        allBindVars.HRIS_HEADER_ID,
        allBindVars.TRX_TYPE,
        allBindVars.HEADER_ID,
        allBindVars.COMPANY_ID,
        allBindVars.COST_CENTER,
        allBindVars.EMPLOYEE_ID,
        allBindVars.EMPLOYEE_NAME,
        allBindVars.NATURAL_ACCOUNT,
        allBindVars.ABSENCE_CARD_NO,
        allBindVars.JOIN_DATE,
        allBindVars.TERMINATE_DATE,
        allBindVars.ORG_ID,
        allBindVars.ORG_NAME,
        allBindVars.POSITION_ID,
        allBindVars.POSITION_TITLE,
        allBindVars.POSITION_LEVEL,
        allBindVars.POSITION_GROUP,
        allBindVars.SALES_FLAG,
        allBindVars.LOCATION_CODE,
        allBindVars.COMPANY_OFFICE,
        allBindVars.WORK_LOCATION,
        allBindVars.GENDER,
        allBindVars.EMAIL,
        allBindVars.SPV_COMPANY_ID,
        allBindVars.SPV_ID,
        allBindVars.SPV_NAME,
        allBindVars.SPV_POSITION_ID,
        allBindVars.SPV_POSITION_NAME,
        allBindVars.BANK_CODE,
        allBindVars.BRANCH_NAME,
        allBindVars.ACCOUNT_NO,
        allBindVars.ACCOUNT_NAME,
        allBindVars.IMPORT_STATUS,
        allBindVars.MESSAGE,
        allBindVars.META_PERSON_ID,
        allBindVars.META_VENDOR_ID,
        allBindVars.META_SALES_ID,
        allBindVars.META_LOCATOR_ID,
        allBindVars.ATTRIBUTE1,
        allBindVars.ATTRIBUTE2,
        allBindVars.ATTRIBUTE3,
        allBindVars.ATTRIBUTE4,
        allBindVars.ATTRIBUTE5,
        allBindVars.ATTRIBUTE6,
        allBindVars.ATTRIBUTE7,
        allBindVars.ATTRIBUTE8,
        allBindVars.ATTRIBUTE9,
        allBindVars.ATTRIBUTE10,
        allBindVars.ATTRIBUTE11,
        allBindVars.ATTRIBUTE12,
        allBindVars.ATTRIBUTE13,
        allBindVars.ATTRIBUTE14,
        allBindVars.ATTRIBUTE15,
        allBindVars.SOURCE_SYSTEM,
        allBindVars.SOURCE_BATCH_ID,
        allBindVars.SOURCE_HEADER_ID,
        allBindVars.SOURCE_LINE_ID,
        allBindVars.CREATED_BY,
        allBindVars.LAST_UPDATE_LOGIN,
        allBindVars.LAST_UPDATED_BY,
        { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }, // For headerId
      ];

      const result = await this.oracleService.executeQuery(query, bindValues);

      // Transform Oracle result to DTO format
      const employees: any[] = result.rows.map((row) => ({
        header_id: row.HEADER_ID,
      }));

      // Prepare response
      const response = {
        data: employees,
        count: employees.length,
        status: true,
        message: 'Employee data retrieved successfully from Oracle',
      };

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
