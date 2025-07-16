import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { SalesOrderTypesDto, SalesOrderTypesQueryDto } from '../dtos/sales-order-types.dtos';

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
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          TRANSACTION_TYPE_ID,
          TRANSACTION_TYPE_NAME,
          DESCRIPTION,
          ORDER_CATEGORY_CODE,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          CREATED_BY,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          LAST_UPDATED_BY,
          LAST_UPDATE_LOGIN
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

  async findSalesOrderTypeById(id: number): Promise<SalesOrderTypesDto> {
    try {
      const query = `
        SELECT 
          TRANSACTION_TYPE_ID,
          TRANSACTION_TYPE_NAME,
          DESCRIPTION,
          ORDER_CATEGORY_CODE,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          CREATED_BY,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          LAST_UPDATED_BY,
          LAST_UPDATE_LOGIN
        FROM APPS.XTD_ONT_SALES_ORDER_TYPES_V
        WHERE TRANSACTION_TYPE_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      
      if (!result.rows.length) {
        throw new Error(`Sales order type with ID ${id} not found`);
      }
      
      this.logger.log(`Found sales order type with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching sales order type with ID ${id}:`, error);
      throw error;
    }
  }

  async countSalesOrderTypes(queryDto: SalesOrderTypesQueryDto = {}): Promise<number> {
    try {
      const { 
        TRANSACTION_TYPE_ID, 
        TRANSACTION_TYPE_NAME, 
        ORDER_CATEGORY_CODE 
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

      const result = await this.oracleService.executeQuery(query, params);
      
      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting sales order types:', error);
      throw error;
    }
  }
}
