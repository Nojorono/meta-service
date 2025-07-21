import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  ArOutstandingsDto,
  ArOutstandingsQueryDto,
} from '../dtos/ar-outstandings.dtos';

@Injectable()
export class ArOutstandingsService {
  private readonly logger = new Logger(ArOutstandingsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllArOutstandings(
    queryDto: ArOutstandingsQueryDto = {},
  ): Promise<ArOutstandingsDto[]> {
    try {
      const {
        CALL_PLAN_NUMBER,
        SFA_DOCUMENT_NUMBER,
        CUSTOMER_NUMBER,
        CUSTOMER_NAME,
        SALESREP_NUMBER,
        ORACLE_INVOICE_NUMBER,
        CUST_ACCOUNT_ID,
        CUSTOMER_TRX_ID,
        ORGANIZATION_CODE,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT
          CALL_PLAN_NUMBER,
          SFA_DOCUMENT_NUMBER,
          TRX_DATE,
          INVOICE_CURRENCY_CODE,
          CUSTOMER_NUMBER,
          CUSTOMER_NAME,
          SALESREP_NUMBER,
          SHIP_TO,
          BILL_TO,
          AMOUNT,
          DUE_REMAINING,
          DUE_DATE,
          ORACLE_INVOICE_NUMBER,
          CUST_ACCOUNT_ID,
          SHIP_TO_SITE_USE_ID,
          BILL_TO_SITE_USE_ID,
          CUSTOMER_TRX_ID,
          LAST_UPDATE_DATE,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_ID,
          ORG_NAME,
          ORG_ID
        FROM APPS.XTD_AR_OUTSTANDINGS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (CALL_PLAN_NUMBER) {
        query += ` AND CALL_PLAN_NUMBER = :${paramIndex}`;
        params.push(CALL_PLAN_NUMBER);
        paramIndex++;
      }
      if (CALL_PLAN_NUMBER) {
        query += ` AND CALL_PLAN_NUMBER = :${paramIndex}`;
        params.push(CALL_PLAN_NUMBER);
        paramIndex++;
      }
      if (SFA_DOCUMENT_NUMBER) {
        query += ` AND UPPER(SFA_DOCUMENT_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(SFA_DOCUMENT_NUMBER);
        paramIndex++;
      }
      if (CUSTOMER_NUMBER) {
        query += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(CUSTOMER_NUMBER);
        paramIndex++;
      }
      if (CUSTOMER_NAME) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NAME}%`);
        paramIndex++;
      }
      if (SALESREP_NUMBER) {
        query += ` AND UPPER(SALESREP_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${SALESREP_NUMBER}%`);
        paramIndex++;
      }
      if (ORACLE_INVOICE_NUMBER) {
        query += ` AND UPPER(ORACLE_INVOICE_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${ORACLE_INVOICE_NUMBER}%`);
        paramIndex++;
      }
      if (CUST_ACCOUNT_ID) {
        query += ` AND UPPER(CUST_ACCOUNT_ID) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUST_ACCOUNT_ID}%`);
        paramIndex++;
      }
      if (CUSTOMER_TRX_ID) {
        query += ` AND UPPER(CUSTOMER_TRX_ID) = UPPER(:${paramIndex})`;
        params.push(CUSTOMER_TRX_ID);
        paramIndex++;
      }
      if (ORGANIZATION_CODE) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(ORGANIZATION_CODE);
        paramIndex++;
      }

      // Pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY CALL_PLAN_NUMBER OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      this.logger.log(`Found ${result.rows.length} AR outstandings`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching AR outstandings:', error);
      throw error;
    }
  }

  async findArOutstandingsById(id: number): Promise<ArOutstandingsDto> {
    try {
      const query = `
        SELECT
          CALL_PLAN_NUMBER,
          SFA_DOCUMENT_NUMBER,
          TRX_DATE,
          INVOICE_CURRENCY_CODE,
          CUSTOMER_NUMBER,
          CUSTOMER_NAME,
          SALESREP_NUMBER,
          SHIP_TO,
          BILL_TO,
          AMOUNT,
          DUE_REMAINING,
          DUE_DATE,
          ORACLE_INVOICE_NUMBER,
          CUST_ACCOUNT_ID,
          SHIP_TO_SITE_USE_ID,
          BILL_TO_SITE_USE_ID,
          CUSTOMER_TRX_ID,
          LAST_UPDATE_DATE,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_ID,
          ORG_NAME,
          ORG_ID
        FROM APPS.XTD_AR_OUTSTANDINGS_V
        WHERE PAYMENT_SCHEDULE_ID = :1
      `;
      const result = await this.oracleService.executeQuery(query, [id]);
      if (!result.rows.length) {
        throw new Error(`AR outstanding with ID ${id} not found`);
      }
      this.logger.log(`Found AR outstanding with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching AR outstanding with ID ${id}:`, error);
      throw error;
    }
  }

  async countArOutstandings(
    queryDto: ArOutstandingsQueryDto = {},
  ): Promise<number> {
    try {
      const {
        CALL_PLAN_NUMBER,
        SFA_DOCUMENT_NUMBER,
        CUSTOMER_NUMBER,
        CUSTOMER_NAME,
        SALESREP_NUMBER,
        ORACLE_INVOICE_NUMBER,
        CUST_ACCOUNT_ID,
        CUSTOMER_TRX_ID,
        ORGANIZATION_CODE,
      } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AR_OUTSTANDINGS_V
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;
      if (CALL_PLAN_NUMBER) {
        query += ` AND CALL_PLAN_NUMBER = :${paramIndex}`;
        params.push(CALL_PLAN_NUMBER);
        paramIndex++;
      }
      if (CALL_PLAN_NUMBER) {
        query += ` AND CALL_PLAN_NUMBER = :${paramIndex}`;
        params.push(CALL_PLAN_NUMBER);
        paramIndex++;
      }
      if (SFA_DOCUMENT_NUMBER) {
        query += ` AND UPPER(SFA_DOCUMENT_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(SFA_DOCUMENT_NUMBER);
        paramIndex++;
      }
      if (CUSTOMER_NUMBER) {
        query += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(CUSTOMER_NUMBER);
        paramIndex++;
      }
      if (CUSTOMER_NAME) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NAME}%`);
        paramIndex++;
      }
      if (SALESREP_NUMBER) {
        query += ` AND UPPER(SALESREP_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${SALESREP_NUMBER}%`);
        paramIndex++;
      }
      if (ORACLE_INVOICE_NUMBER) {
        query += ` AND UPPER(ORACLE_INVOICE_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${ORACLE_INVOICE_NUMBER}%`);
        paramIndex++;
      }
      if (CUST_ACCOUNT_ID) {
        query += ` AND UPPER(CUST_ACCOUNT_ID) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUST_ACCOUNT_ID}%`);
        paramIndex++;
      }
      if (CUSTOMER_TRX_ID) {
        query += ` AND UPPER(CUSTOMER_TRX_ID) = UPPER(:${paramIndex})`;
        params.push(CUSTOMER_TRX_ID);
        paramIndex++;
      }
      if (ORGANIZATION_CODE) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(ORGANIZATION_CODE);
        paramIndex++;
      }
      const result = await this.oracleService.executeQuery(query, params);
      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting AR outstandings:', error);
      throw error;
    }
  }

  // Compatibility alias for controller
  async findAll(
    query: ArOutstandingsQueryDto = {},
  ): Promise<ArOutstandingsDto[]> {
    return this.findAllArOutstandings(query);
  }

  // Compatibility alias for controller
  async findOne(id: number): Promise<ArOutstandingsDto> {
    return this.findArOutstandingsById(id);
  }
}
