import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  ArCustomersSdDto,
  ArCustomersSdQueryDto,
} from '../dtos/ar-customers-sd.dtos';

@Injectable()
export class ArCustomersSdService {
  private readonly logger = new Logger(ArCustomersSdService.name);

  constructor(private readonly oracleService: OracleService) { }

  async findAllCustomers(
    queryDto: ArCustomersSdQueryDto = {},
  ): Promise<ArCustomersSdDto[]> {
    try {
      const {
        customerNumber,
        customerName,
        custAccountId,
        orgId,
        status,
        channel,
        provinsi,
        kabKodya,
        kecamatan,
        siteType,
        priceListId,
      } = queryDto;

      let query = `
        SELECT 
          ADDRESS1,
          BILL_TO_LOCATION,
          BILL_TO_SITE_USE_ID,
          CHANNEL,
          CREDIT_CHECKING,
          CUST_ACCOUNT_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          KAB_KODYA,
          KECAMATAN,
          KELURAHAN,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS') AS LAST_UPDATE_DATE,
          ORDER_TYPE_ID,
          ORDER_TYPE_NAME,
          ORG_ID,
          OVERALL_CREDIT_LIMIT,
          PRICE_LIST_ID,
          PRICE_LIST_NAME,
          PROVINSI,
          RETURN_ORDER_TYPE_ID,
          RETURN_ORDER_TYPE_NAME,
          SHIP_TO_LOCATION,
          SHIP_TO_SITE_USE_ID,
          SITE_TYPE,
          STATUS,
          TERM_DAY,
          TERM_ID,
          TERM_NAME,
          TRX_CREDIT_LIMIT
        FROM APPS.XTD_AR_CUSTOMERS_SD_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (customerNumber) {
        query += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${customerNumber}%`);
        paramIndex++;
      }

      if (customerName) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${customerName}%`);
        paramIndex++;
      }

      if (custAccountId) {
        query += ` AND CUST_ACCOUNT_ID = :${paramIndex}`;
        params.push(custAccountId);
        paramIndex++;
      }

      if (orgId) {
        query += ` AND ORG_ID = :${paramIndex}`;
        params.push(orgId);
        paramIndex++;
      }

      if (status) {
        query += ` AND UPPER(STATUS) = UPPER(:${paramIndex})`;
        params.push(status);
        paramIndex++;
      }

      if (channel) {
        query += ` AND UPPER(CHANNEL) LIKE UPPER(:${paramIndex})`;
        params.push(`%${channel}%`);
        paramIndex++;
      }

      if (provinsi) {
        query += ` AND UPPER(PROVINSI) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsi}%`);
        paramIndex++;
      }

      if (kabKodya) {
        query += ` AND UPPER(KAB_KODYA) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kabKodya}%`);
        paramIndex++;
      }

      if (kecamatan) {
        query += ` AND UPPER(KECAMATAN) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatan}%`);
        paramIndex++;
      }

      if (siteType) {
        query += ` AND UPPER(SITE_TYPE) = UPPER(:${paramIndex})`;
        params.push(siteType);
        paramIndex++;
      }

      if (priceListId) {
        query += ` AND PRICE_LIST_ID = :${paramIndex}`;
        params.push(priceListId);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} customers`);
      return result.rows as ArCustomersSdDto[];
    } catch (error) {
      this.logger.error('Error finding customers:', error);
      throw error;
    }
  }

  async findCustomerById(
    custAccountId: number,
  ): Promise<ArCustomersSdDto | null> {
    try {
      const query = `
        SELECT 
          ADDRESS1,
          BILL_TO_LOCATION,
          BILL_TO_SITE_USE_ID,
          CHANNEL,
          CREDIT_CHECKING,
          CUST_ACCOUNT_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          KAB_KODYA,
          KECAMATAN,
          KELURAHAN,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS') AS LAST_UPDATE_DATE,
          ORDER_TYPE_ID,
          ORDER_TYPE_NAME,
          ORG_ID,
          OVERALL_CREDIT_LIMIT,
          PRICE_LIST_ID,
          PRICE_LIST_NAME,
          PROVINSI,
          RETURN_ORDER_TYPE_ID,
          RETURN_ORDER_TYPE_NAME,
          SHIP_TO_LOCATION,
          SHIP_TO_SITE_USE_ID,
          SITE_TYPE,
          STATUS,
          TERM_DAY,
          TERM_ID,
          TERM_NAME,
          TRX_CREDIT_LIMIT
        FROM APPS.XTD_AR_CUSTOMERS_SD_V
        WHERE CUST_ACCOUNT_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        custAccountId,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(
          `Customer not found for CUST_ACCOUNT_ID: ${custAccountId}`,
        );
        return null;
      }

      this.logger.log(`Found customer: ${custAccountId}`);
      return result.rows[0] as ArCustomersSdDto;
    } catch (error) {
      this.logger.error(
        `Error finding customer by ID ${custAccountId}:`,
        error,
      );
      throw error;
    }
  }

  async findCustomerByNumber(
    customerNumber: string,
  ): Promise<ArCustomersSdDto[]> {
    try {
      const query = `
        SELECT 
          ADDRESS1,
          BILL_TO_LOCATION,
          BILL_TO_SITE_USE_ID,
          CHANNEL,
          CREDIT_CHECKING,
          CUST_ACCOUNT_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          KAB_KODYA,
          KECAMATAN,
          KELURAHAN,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS') AS LAST_UPDATE_DATE,
          ORDER_TYPE_ID,
          ORDER_TYPE_NAME,
          ORG_ID,
          OVERALL_CREDIT_LIMIT,
          PRICE_LIST_ID,
          PRICE_LIST_NAME,
          PROVINSI,
          RETURN_ORDER_TYPE_ID,
          RETURN_ORDER_TYPE_NAME,
          SHIP_TO_LOCATION,
          SHIP_TO_SITE_USE_ID,
          SITE_TYPE,
          STATUS,
          TERM_DAY,
          TERM_ID,
          TERM_NAME,
          TRX_CREDIT_LIMIT
        FROM APPS.XTD_AR_CUSTOMERS_SD_V
        WHERE CUSTOMER_NUMBER = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        customerNumber,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(
          `Customer not found for number: ${customerNumber}`,
        );
        return [];
      }

      this.logger.log(`Found ${result.rows.length} customer(s): ${customerNumber}`);
      return result.rows as ArCustomersSdDto[];
    } catch (error) {
      this.logger.error(
        `Error finding customer by number ${customerNumber}:`,
        error,
      );
      throw error;
    }
  }

  async getCustomersCount(
    queryDto: ArCustomersSdQueryDto = {},
  ): Promise<number> {
    try {
      const {
        customerNumber,
        customerName,
        custAccountId,
        orgId,
        status,
        channel,
        provinsi,
        kabKodya,
        kecamatan,
        siteType,
        priceListId,
      } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_AR_CUSTOMERS_SD_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (customerNumber) {
        query += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${customerNumber}%`);
        paramIndex++;
      }

      if (customerName) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${customerName}%`);
        paramIndex++;
      }

      if (custAccountId) {
        query += ` AND CUST_ACCOUNT_ID = :${paramIndex}`;
        params.push(custAccountId);
        paramIndex++;
      }

      if (orgId) {
        query += ` AND ORG_ID = :${paramIndex}`;
        params.push(orgId);
        paramIndex++;
      }

      if (status) {
        query += ` AND UPPER(STATUS) = UPPER(:${paramIndex})`;
        params.push(status);
        paramIndex++;
      }

      if (channel) {
        query += ` AND UPPER(CHANNEL) LIKE UPPER(:${paramIndex})`;
        params.push(`%${channel}%`);
        paramIndex++;
      }

      if (provinsi) {
        query += ` AND UPPER(PROVINSI) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsi}%`);
        paramIndex++;
      }

      if (kabKodya) {
        query += ` AND UPPER(KAB_KODYA) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kabKodya}%`);
        paramIndex++;
      }

      if (kecamatan) {
        query += ` AND UPPER(KECAMATAN) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatan}%`);
        paramIndex++;
      }

      if (siteType) {
        query += ` AND UPPER(SITE_TYPE) = UPPER(:${paramIndex})`;
        params.push(siteType);
        paramIndex++;
      }

      if (priceListId) {
        query += ` AND PRICE_LIST_ID = :${paramIndex}`;
        params.push(priceListId);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;

      this.logger.log(`Total customers count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting customers count:', error);
      throw error;
    }
  }
}

