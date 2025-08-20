import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  SalesOrderTypesDto,
  SalesOrderTypesQueryDto,
} from '../dtos/sales-order-types.dtos';

@Injectable()
export class SalesOrderTypesService {
  private readonly logger = new Logger(SalesOrderTypesService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllSalesOrderTypes(
    queryDto: SalesOrderTypesQueryDto = {},
  ): Promise<SalesOrderTypesDto[]> {
    try {
      const {
        TRANSACTION_TYPE_ID,
        TRANSACTION_TYPE_NAME,
        ORDER_CATEGORY_CODE,
        ORGANIZATION_CODE,
        TRANSACTION_TYPE_DMS,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          ORDER_CATEGORY_CODE,
          TRANSACTION_TYPE_NAME,
          TRANSACTION_TYPE_ID,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          RETURN_TRANSACTION_TYPE_NAME,
          RETURN_TRANSACTION_TYPE_ID,
          RETURN_START_DATE_ACTIVE,
          RETURN_END_DATE_ACTIVE,
          LINE_TRANSACTION_TYPE_NAME,
          LINE_TRANSACTION_TYPE_ID,
          LINE_START_DATE_ACTIVE,
          LINE_END_DATE_ACTIVE,
          LINE_DISC_TRANSACTION_TYPE_NAME,
          LINE_DISC_TRANSACTION_TYPE_ID,
          LINE_DISC_START_DATE_ACTIVE,
          LINE_DISC_END_DATE_ACTIVE,
          TRANSACTION_TYPE_DMS,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_ID,
          ORG_NAME,
          ORG_ID,
          LAST_UPDATE_DATE
        FROM APPS.XTD_ONT_SALES_ORDER_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TRANSACTION_TYPE_ID) {
        query += ` AND TRANSACTION_TYPE_ID = :${paramIndex}`;
        params.push(TRANSACTION_TYPE_ID);
        paramIndex++;
      }

      if (TRANSACTION_TYPE_NAME) {
        query += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${TRANSACTION_TYPE_NAME}%`);
        paramIndex++;
      }

      if (ORDER_CATEGORY_CODE) {
        query += ` AND UPPER(ORDER_CATEGORY_CODE) = UPPER(:${paramIndex})`;
        params.push(ORDER_CATEGORY_CODE);
        paramIndex++;
      }

      if (ORGANIZATION_CODE) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(ORGANIZATION_CODE);
        paramIndex++;
      }

      if (TRANSACTION_TYPE_DMS) {
        query += ` AND UPPER(TRANSACTION_TYPE_DMS) = UPPER(:${paramIndex})`;
        params.push(TRANSACTION_TYPE_DMS);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY TRANSACTION_TYPE_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} sales order types`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching sales order types:', error);
      throw error;
    }
  }

  async findSalesOrderTypeById(id: number): Promise<SalesOrderTypesDto | null> {
    try {
      const query = `
        SELECT 
          ORDER_CATEGORY_CODE,
          TRANSACTION_TYPE_NAME,
          TRANSACTION_TYPE_ID,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          RETURN_TRANSACTION_TYPE_NAME,
          RETURN_TRANSACTION_TYPE_ID,
          RETURN_START_DATE_ACTIVE,
          RETURN_END_DATE_ACTIVE,
          LINE_TRANSACTION_TYPE_NAME,
          LINE_TRANSACTION_TYPE_ID,
          LINE_START_DATE_ACTIVE,
          LINE_END_DATE_ACTIVE,
          LINE_DISC_TRANSACTION_TYPE_NAME,
          LINE_DISC_TRANSACTION_TYPE_ID,
          LINE_DISC_START_DATE_ACTIVE,
          LINE_DISC_END_DATE_ACTIVE,
          TRANSACTION_TYPE_DMS,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_ID,
          ORG_NAME,
          ORG_ID,
          LAST_UPDATE_DATE
        FROM APPS.XTD_ONT_SALES_ORDER_TYPES_V
        WHERE TRANSACTION_TYPE_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      this.logger.error(
        `Error fetching sales order type with ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async countSalesOrderTypes(
    queryDto: SalesOrderTypesQueryDto = {},
  ): Promise<number> {
    try {
      const {
        TRANSACTION_TYPE_ID,
        TRANSACTION_TYPE_NAME,
        ORDER_CATEGORY_CODE,
        ORGANIZATION_CODE,
        TRANSACTION_TYPE_DMS,
      } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_ONT_SALES_ORDER_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TRANSACTION_TYPE_ID) {
        query += ` AND TRANSACTION_TYPE_ID = :${paramIndex}`;
        params.push(TRANSACTION_TYPE_ID);
        paramIndex++;
      }

      if (TRANSACTION_TYPE_NAME) {
        query += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${TRANSACTION_TYPE_NAME}%`);
        paramIndex++;
      }

      if (ORDER_CATEGORY_CODE) {
        query += ` AND UPPER(ORDER_CATEGORY_CODE) = UPPER(:${paramIndex})`;
        params.push(ORDER_CATEGORY_CODE);
        paramIndex++;
      }

      if (ORGANIZATION_CODE) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(ORGANIZATION_CODE);
        paramIndex++;
      }

      if (TRANSACTION_TYPE_DMS) {
        query += ` AND UPPER(TRANSACTION_TYPE_DMS) = UPPER(:${paramIndex})`;
        params.push(TRANSACTION_TYPE_DMS);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting sales order types:', error);
      throw error;
    }
  }
}
