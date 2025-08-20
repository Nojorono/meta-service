import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  ReceiptMethodDto,
  ReceiptMethodQueryDto,
} from '../dtos/receipt-method.dtos';

@Injectable()
export class ReceiptMethodService {
  private readonly logger = new Logger(ReceiptMethodService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllReceiptMethods(
    queryDto: ReceiptMethodQueryDto = {},
  ): Promise<ReceiptMethodDto[]> {
    try {
      const {
        receiptMethodName,
        receiptClasses,
        organizationCode,
        currencyCode,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          RECEIPT_CLASSES,
          PRINTED_NAME,
          RECEIPT_METHOD_NAME,
          RECEIPT_METHOD_ID,
          BANK_NAME,
          BANK_BRANCH_NAME,
          BANK_ACCOUNT_NUMBER,
          BANK_ACCOUNT_NAME,
          BANK_ID,
          BANK_BRANCH_ID,
          BANK_ACCOUNT_ID,
          CURRENCY_CODE,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          SALES_FLAG,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORG_NAME,
          ORG_ID,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AR_RECEIPT_METHODS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (receiptMethodName) {
        query += ` AND UPPER(RECEIPT_METHOD_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${receiptMethodName}%`);
        paramIndex++;
      }

      if (receiptClasses) {
        query += ` AND UPPER(RECEIPT_CLASSES) LIKE UPPER(:${paramIndex})`;
        params.push(`%${receiptClasses}%`);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      if (currencyCode) {
        query += ` AND UPPER(CURRENCY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${currencyCode}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY RECEIPT_METHOD_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} receipt methods`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching receipt methods:', error);
      throw error;
    }
  }

  async findReceiptMethodById(id: number): Promise<ReceiptMethodDto> {
    try {
      const query = `
        SELECT 
          RECEIPT_CLASSES,
          PRINTED_NAME,
          RECEIPT_METHOD_NAME,
          RECEIPT_METHOD_ID,
          BANK_NAME,
          BANK_BRANCH_NAME,
          BANK_ACCOUNT_NUMBER,
          BANK_ACCOUNT_NAME,
          BANK_ID,
          BANK_BRANCH_ID,
          BANK_ACCOUNT_ID,
          CURRENCY_CODE,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          SALES_FLAG,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORG_NAME,
          ORG_ID,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AR_RECEIPT_METHODS_V
        WHERE RECEIPT_METHOD_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      this.logger.log(`Found receipt method with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching receipt method with ID ${id}:`, error);
      throw error;
    }
  }

  async countReceiptMethods(
    queryDto: ReceiptMethodQueryDto = {},
  ): Promise<number> {
    try {
      const {
        receiptMethodName,
        receiptClasses,
        organizationCode,
        currencyCode,
      } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AR_RECEIPT_METHODS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (receiptMethodName) {
        query += ` AND UPPER(RECEIPT_METHOD_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${receiptMethodName}%`);
        paramIndex++;
      }

      if (receiptClasses) {
        query += ` AND UPPER(RECEIPT_CLASSES) LIKE UPPER(:${paramIndex})`;
        params.push(`%${receiptClasses}%`);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      if (currencyCode) {
        query += ` AND UPPER(CURRENCY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${currencyCode}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting receipt methods:', error);
      throw error;
    }
  }
}
