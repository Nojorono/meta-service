import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MetaCustomerDto,
  MetaCustomerResponseDto,
  PaginationParamsDto,
} from '../dto/customer.dto';
import { OracleService } from '../../../common/services/oracle.service';

@Injectable()
export class CustomerMetaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
  ) {}

  async getCustomersFromOracle(
    params?: PaginationParamsDto,
  ): Promise<MetaCustomerResponseDto> {
    // Set default values if not provided
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const search = params?.search || '';
    try {
      // Using uppercase for object names since Oracle typically stores them in uppercase
      // This aligns with the memory about uppercase role names in the database
      let query = `
        SELECT * FROM APPS.XTD_AR_CUSTOMERS_V
              `;

      // Add search condition if search term is provided
      const params = [];
      if (search) {
        query += ` AND (UPPER(CUSTOMER_NAME) LIKE UPPER('%' || :search || '%') OR UPPER(CUSTOMER_NUMBER) LIKE UPPER('%' || :search || '%'))`;
        params.push(search);
      }

      // Count total records for pagination
      const countQuery = `
        SELECT COUNT(*) AS TOTAL FROM (${query})
      `;

      const countResult = await this.oracleService.executeQuery(
        countQuery,
        params,
      );
      const totalCount = parseInt(countResult.rows[0].TOTAL, 10) || 0;

      // Add pagination
      query += `
        OFFSET ${(page - 1) * limit} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;

      const result = await this.oracleService.executeQuery(query, params);

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

      // Calculate pagination metadata
      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: customers,
        count: totalCount,
        totalPages,
        currentPage: page,
        limit,
        status: true,
        message: 'Customer data retrieved successfully from Oracle',
      };
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

      return {
        data: [customer],
        count: 1,
        status: true,
        message: 'Customer data retrieved successfully from Oracle',
      };
    } catch (error) {
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving customer data: ${error.message}`,
      };
    }
  }
}
