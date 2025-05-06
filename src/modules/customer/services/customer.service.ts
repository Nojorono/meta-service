import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MetaCustomerDto,
  MetaCustomerDtoByDate,
  MetaCustomerResponseDto,
  PaginationParamsDto,
} from '../dtos/customer.dtos';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';

@Injectable()
export class CustomerMetaService {
  private readonly logger = new Logger(CustomerMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getCustomersFromOracle(
    params?: PaginationParamsDto,
  ): Promise<MetaCustomerResponseDto> {
    // Set default values if not provided
    const page = params?.page;
    const limit = params?.limit;
    const search = params?.search || '';

    // Generate unique cache key based on parameters
    const cacheKey =
      page && limit
        ? `customers:page:${page}:limit:${limit}:search:${search}`
        : `customers:all:search:${search}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaCustomerResponseDto;
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
        SELECT * FROM APPS.XTD_AR_CUSTOMERS_V
        WHERE 1=1
      `;

      // Add search condition if search term is provided
      const queryParams = [];
      if (search) {
        query += ` AND (UPPER(CUSTOMER_NAME) LIKE UPPER('%' || :search || '%') OR UPPER(CUSTOMER_NUMBER) LIKE UPPER('%' || :search || '%'))`;
        queryParams.push(search);
      }

      // Count total records for pagination
      const countQuery = `
        SELECT COUNT(*) AS TOTAL FROM (${query})
      `;

      const countResult = await this.oracleService.executeQuery(
        countQuery,
        queryParams,
      );
      const totalCount = parseInt(countResult.rows[0].TOTAL, 10) || 0;

      // Apply pagination if page and limit are provided
      if (page !== undefined && limit !== undefined) {
        query += `
          OFFSET ${(page - 1) * limit} ROWS
          FETCH NEXT ${limit} ROWS ONLY
        `;
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      // Transform Oracle result to DTO format
      const customers: MetaCustomerDto[] = result.rows.map((row) => ({
        cust_account_id: row.CUST_ACCOUNT_ID,
        customer_name: row.CUSTOMER_NAME,
        customer_number: row.CUSTOMER_NUMBER,
        address1: row.ADDRESS1,
        bill_to_location: row.BILL_TO_LOCATION,
        bill_to_site_use_id: row.BILL_TO_SITE_USE_ID,
        channel: row.CHANNEL,
        credit_checking: row.CREDIT_CHECKING,
        credit_exposure: row.CREDIT_EXPOSURE,
        kab_kodya: row.KAB_KODYA,
        kecamatan: row.KECAMATAN,
        kelurahan: row.KELURAHAN,
        last_update_date: row.LAST_UPDATE_DATE,
        order_type_id: row.ORDER_TYPE_ID,
        order_type_name: row.ORDER_TYPE_NAME,
        org_id: row.ORG_ID,
        org_name: row.ORG_NAME,
        organization_code: row.ORGANIZATION_CODE,
        organization_id: row.ORGANIZATION_ID,
        organization_name: row.ORGANIZATION_NAME,
        overall_credit_limit: row.OVERALL_CREDIT_LIMIT,
        price_list_id: row.PRICE_LIST_ID,
        price_list_name: row.PRICE_LIST_NAME,
        provinsi: row.PROVINSI,
        return_order_type_id: row.RETURN_ORDER_TYPE_ID,
        return_order_type_name: row.RETURN_ORDER_TYPE_NAME,
        ship_to_location: row.SHIP_TO_LOCATION,
        ship_to_site_use_id: row.SHIP_TO_SITE_USE_ID,
        site_type: row.SITE_TYPE,
        status: row.STATUS,
        term_day: row.TERM_DAY,
        term_id: row.TERM_ID,
        term_name: row.TERM_NAME,
        trx_credit_limit: row.TRX_CREDIT_LIMIT,
      }));

      // Prepare response
      const response: MetaCustomerResponseDto = {
        data: customers,
        count: totalCount,
        status: true,
        message: 'Customer data retrieved successfully from Oracle',
      };

      // Add pagination metadata if pagination is used
      if (page !== undefined && limit !== undefined) {
        response.totalPages = Math.ceil(totalCount / limit);
        response.currentPage = page;
        response.limit = limit;
      }

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
        message: `Error retrieving customer data: ${error.message}`,
      };
    }
  }

  async getCustomersFromOracleByDate(
    params?: MetaCustomerDtoByDate,
  ): Promise<MetaCustomerResponseDto> {
    // Set default values if not provided
    const last_update_date = params;

    this.logger.log('params.last_update_date' + last_update_date);
    this.logger.log('params' + params);

    // Generate unique cache key based on parameters
    const cacheKey = last_update_date
      ? `customers:last_update_date:${last_update_date}`
      : `customers:last_update_date:${last_update_date}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaCustomerResponseDto;
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
        SELECT * FROM APPS.XTD_AR_CUSTOMERS_V
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
      const customers: MetaCustomerDto[] = result.rows.map((row) => ({
        cust_account_id: row.CUST_ACCOUNT_ID,
        customer_name: row.CUSTOMER_NAME,
        customer_number: row.CUSTOMER_NUMBER,
        address1: row.ADDRESS1,
        bill_to_location: row.BILL_TO_LOCATION,
        bill_to_site_use_id: row.BILL_TO_SITE_USE_ID,
        channel: row.CHANNEL,
        credit_checking: row.CREDIT_CHECKING,
        credit_exposure: row.CREDIT_EXPOSURE,
        kab_kodya: row.KAB_KODYA,
        kecamatan: row.KECAMATAN,
        kelurahan: row.KELURAHAN,
        last_update_date: row.LAST_UPDATE_DATE,
        order_type_id: row.ORDER_TYPE_ID,
        order_type_name: row.ORDER_TYPE_NAME,
        org_id: row.ORG_ID,
        org_name: row.ORG_NAME,
        organization_code: row.ORGANIZATION_CODE,
        organization_id: row.ORGANIZATION_ID,
        organization_name: row.ORGANIZATION_NAME,
        overall_credit_limit: row.OVERALL_CREDIT_LIMIT,
        price_list_id: row.PRICE_LIST_ID,
        price_list_name: row.PRICE_LIST_NAME,
        provinsi: row.PROVINSI,
        return_order_type_id: row.RETURN_ORDER_TYPE_ID,
        return_order_type_name: row.RETURN_ORDER_TYPE_NAME,
        ship_to_location: row.SHIP_TO_LOCATION,
        ship_to_site_use_id: row.SHIP_TO_SITE_USE_ID,
        site_type: row.SITE_TYPE,
        status: row.STATUS,
        term_day: row.TERM_DAY,
        term_id: row.TERM_ID,
        term_name: row.TERM_NAME,
        trx_credit_limit: row.TRX_CREDIT_LIMIT,
      }));

      // Prepare response
      const response: MetaCustomerResponseDto = {
        data: customers,
        count: customers.length,
        status: true,
        message: 'Customer data retrieved successfully from Oracle',
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
        message: `Error retrieving customer data: ${error.message}`,
      };
    }
  }

  async getCustomerByIdFromOracle(
    customerId: number,
  ): Promise<MetaCustomerResponseDto> {
    // Generate cache key for customer by ID
    const cacheKey = `customer:id:${customerId}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaCustomerResponseDto;
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
      const query = `
        SELECT * FROM APPS.XTD_AR_CUSTOMERS_V
        WHERE CUST_ACCOUNT_ID = :customerId
      `;

      const result = await this.oracleService.executeQuery(query, [customerId]);

      if (result.rows.length === 0) {
        return {
          data: [],
          count: 0,
          status: false,
          message: `Customer with ID ${customerId} not found`,
        };
      }

      const customer: MetaCustomerDto = {
        cust_account_id: result.rows[0].CUST_ACCOUNT_ID,
        customer_name: result.rows[0].CUSTOMER_NAME,
        customer_number: result.rows[0].CUSTOMER_NUMBER,
        address1: result.rows[0].ADDRESS1,
        bill_to_location: result.rows[0].BILL_TO_LOCATION,
        bill_to_site_use_id: result.rows[0].BILL_TO_SITE_USE_ID,
        channel: result.rows[0].CHANNEL,
        credit_checking: result.rows[0].CREDIT_CHECKING,
        credit_exposure: result.rows[0].CREDIT_EXPOSURE,
        kab_kodya: result.rows[0].KAB_KODYA,
        kecamatan: result.rows[0].KECAMATAN,
        kelurahan: result.rows[0].KELURAHAN,
        last_update_date: result.rows[0].LAST_UPDATE_DATE,
        order_type_id: result.rows[0].ORDER_TYPE_ID,
        order_type_name: result.rows[0].ORDER_TYPE_NAME,
        org_id: result.rows[0].ORG_ID,
        org_name: result.rows[0].ORG_NAME,
        organization_code: result.rows[0].ORGANIZATION_CODE,
        organization_id: result.rows[0].ORGANIZATION_ID,
        organization_name: result.rows[0].ORGANIZATION_NAME,
        overall_credit_limit: result.rows[0].OVERALL_CREDIT_LIMIT,
        price_list_id: result.rows[0].PRICE_LIST_ID,
        price_list_name: result.rows[0].PRICE_LIST_NAME,
        provinsi: result.rows[0].PROVINSI,
        return_order_type_id: result.rows[0].RETURN_ORDER_TYPE_ID,
        return_order_type_name: result.rows[0].RETURN_ORDER_TYPE_NAME,
        ship_to_location: result.rows[0].SHIP_TO_LOCATION,
        ship_to_site_use_id: result.rows[0].SHIP_TO_SITE_USE_ID,
        site_type: result.rows[0].SITE_TYPE,
        status: result.rows[0].STATUS,
        term_day: result.rows[0].TERM_DAY,
        term_id: result.rows[0].TERM_ID,
        term_name: result.rows[0].TERM_NAME,
        trx_credit_limit: result.rows[0].TRX_CREDIT_LIMIT,
      };

      const response = {
        data: [customer],
        count: 1,
        status: true,
        message: 'Customer data retrieved successfully from Oracle',
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
        `Error in getCustomerByIdFromOracle: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving customer data: ${error.message}`,
      };
    }
  }

  /**
   * Invalidates customer-related caches
   * @param customerId Optional customer ID to invalidate specific customer cache
   */
  async invalidateCustomerCache(customerId?: number): Promise<void> {
    try {
      if (customerId) {
        // Invalidate specific customer cache
        const cacheKey = `customer:id:${customerId}`;
        await this.redisService.delete(cacheKey);
        this.logger.log(`Invalidated cache for customer ID ${customerId}`);
      }

      // Invalidate all customers list cache entries
      await this.redisService.deleteByPattern('customers:page:*');
      this.logger.log('Invalidated all customers list caches');
    } catch (error) {
      this.logger.error(
        `Error invalidating cache: ${error.message}`,
        error.stack,
      );
    }
  }
}
