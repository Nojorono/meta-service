import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  TransactionTypeDto,
  TransactionTypeQueryDto,
} from '../dtos/transaction-type.dtos';

@Injectable()
export class TransactionTypeService {
  private readonly logger = new Logger(TransactionTypeService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllTransactionTypes(
    queryDto: TransactionTypeQueryDto = {},
  ): Promise<TransactionTypeDto[]> {
    try {
      const {
        transactionTypeName,
        transactionTypeDms,
        status,
        organizationCode,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          *
        FROM APPS.XTD_INV_TRANSACTION_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (transactionTypeName) {
        query += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${transactionTypeName}%`);
        paramIndex++;
      }

      if (transactionTypeDms) {
        query += ` AND UPPER(TRANSACTION_TYPE_DMS) LIKE UPPER(:${paramIndex})`;
        params.push(`%${transactionTypeDms}%`);
        paramIndex++;
      }

      if (status) {
        query += ` AND STATUS = :${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY TRANSACTION_TYPE_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} transaction types`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching transaction types:', error);
      throw error;
    }
  }

  async findTransactionTypeById(id: number): Promise<TransactionTypeDto> {
    try {
      const query = `
        SELECT 
          TRANSACTION_TYPE_NAME,
          TRANSACTION_TYPE_ID,
          DESCRIPTION,
          STATUS,
          STATUS_DESCRIPTION,
          TRANSACTION_TYPE_DMS,
          MOVE_ORDER_TYPE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          TRANSACTION_SOURCE_TYPE_ID,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_ID,
          ORG_NAME,
          ORG_ID,
          CODE_COMBINATION_ID
        FROM APPS.XTD_INV_TRANSACTION_TYPES_V
        WHERE TRANSACTION_TYPE_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      this.logger.log(`Found transaction type with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(
        `Error fetching transaction type with ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async countTransactionTypes(
    queryDto: TransactionTypeQueryDto = {},
  ): Promise<number> {
    try {
      const {
        transactionTypeName,
        transactionTypeDms,
        status,
        organizationCode,
      } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_INV_TRANSACTION_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (transactionTypeName) {
        query += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${transactionTypeName}%`);
        paramIndex++;
      }

      if (transactionTypeDms) {
        query += ` AND UPPER(TRANSACTION_TYPE_DMS) LIKE UPPER(:${paramIndex})`;
        params.push(`%${transactionTypeDms}%`);
        paramIndex++;
      }

      if (status) {
        query += ` AND STATUS = :${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting transaction types:', error);
      throw error;
    }
  }
}
