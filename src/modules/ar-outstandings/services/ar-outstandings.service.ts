import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { ArOutstandingsDto, ArOutstandingsQueryDto } from '../dtos/ar-outstandings.dtos';

@Injectable()
export class ArOutstandingsService {
  private readonly logger = new Logger(ArOutstandingsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllArOutstandings(queryDto: ArOutstandingsQueryDto = {}): Promise<ArOutstandingsDto[]> {
    try {
      const {
        CUSTOMER_ID,
        CUSTOMER_NUMBER,
        CUSTOMER_NAME,
        INVOICE_NUMBER,
        CURRENCY_CODE,
        STATUS,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT
          PAYMENT_SCHEDULE_ID,
          CUSTOMER_ID,
          CUSTOMER_NUMBER,
          CUSTOMER_NAME,
          INVOICE_NUMBER,
          INVOICE_DATE,
          DUE_DATE,
          CURRENCY_CODE,
          AMOUNT_DUE,
          STATUS,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AR_OUTSTANDINGS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (CUSTOMER_ID) {
        query += ` AND CUSTOMER_ID = :${paramIndex}`;
        params.push(CUSTOMER_ID);
        paramIndex++;
      }
      if (CUSTOMER_NUMBER) {
        query += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NUMBER}%`);
        paramIndex++;
      }
      if (CUSTOMER_NAME) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NAME}%`);
        paramIndex++;
      }
      if (INVOICE_NUMBER) {
        query += ` AND UPPER(INVOICE_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${INVOICE_NUMBER}%`);
        paramIndex++;
      }
      if (CURRENCY_CODE) {
        query += ` AND UPPER(CURRENCY_CODE) = UPPER(:${paramIndex})`;
        params.push(CURRENCY_CODE);
        paramIndex++;
      }
      if (STATUS) {
        query += ` AND UPPER(STATUS) = UPPER(:${paramIndex})`;
        params.push(STATUS);
        paramIndex++;
      }

      // Pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY PAYMENT_SCHEDULE_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
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
          PAYMENT_SCHEDULE_ID,
          CUSTOMER_ID,
          CUSTOMER_NUMBER,
          CUSTOMER_NAME,
          INVOICE_NUMBER,
          INVOICE_DATE,
          DUE_DATE,
          CURRENCY_CODE,
          AMOUNT_DUE,
          STATUS,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
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

  async countArOutstandings(queryDto: ArOutstandingsQueryDto = {}): Promise<number> {
    try {
      const {
        CUSTOMER_ID,
        CUSTOMER_NUMBER,
        CUSTOMER_NAME,
        INVOICE_NUMBER,
        CURRENCY_CODE,
        STATUS,
      } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AR_OUTSTANDINGS_V
        WHERE 1=1
      `;
      const params: any[] = [];
      let paramIndex = 1;
      if (CUSTOMER_ID) {
        query += ` AND CUSTOMER_ID = :${paramIndex}`;
        params.push(CUSTOMER_ID);
        paramIndex++;
      }
      if (CUSTOMER_NUMBER) {
        query += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NUMBER}%`);
        paramIndex++;
      }
      if (CUSTOMER_NAME) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NAME}%`);
        paramIndex++;
      }
      if (INVOICE_NUMBER) {
        query += ` AND UPPER(INVOICE_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${INVOICE_NUMBER}%`);
        paramIndex++;
      }
      if (CURRENCY_CODE) {
        query += ` AND UPPER(CURRENCY_CODE) = UPPER(:${paramIndex})`;
        params.push(CURRENCY_CODE);
        paramIndex++;
      }
      if (STATUS) {
        query += ` AND UPPER(STATUS) = UPPER(:${paramIndex})`;
        params.push(STATUS);
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
  async findAll(query: ArOutstandingsQueryDto = {}): Promise<ArOutstandingsDto[]> {
    return this.findAllArOutstandings(query);
  }

  // Compatibility alias for controller
  async findOne(id: number): Promise<ArOutstandingsDto> {
    return this.findArOutstandingsById(id);
  }
}
