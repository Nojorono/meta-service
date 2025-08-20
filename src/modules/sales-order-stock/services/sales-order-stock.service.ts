import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  SalesOrderStockDto,
  SalesOrderStockQueryDto,
} from '../dtos/sales-order-stock.dtos';

@Injectable()
export class SalesOrderStockService {
  private readonly logger = new Logger(SalesOrderStockService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllSalesOrderStock(
    queryDto: SalesOrderStockQueryDto = {},
  ): Promise<SalesOrderStockDto[]> {
    try {
      const { FPPR_NUMBER, ITEM, page = 1, limit = 10 } = queryDto;

      let query = `
        SELECT 
          *
        FROM APPS.XTD_ONT_SALES_ORDER_STOCK_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (FPPR_NUMBER) {
        query += ` AND FPPR_NUMBER = :${paramIndex}`;
        params.push(FPPR_NUMBER);
        paramIndex++;
      }

      if (ITEM) {
        query += ` AND UPPER(ITEM) LIKE UPPER(:${paramIndex})`;
        params.push(`%${ITEM}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY FPPR_NUMBER OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} sales order stock records`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching sales order stock:', error);
      throw error;
    }
  }

  async findSalesOrderStockById(
    id: number,
  ): Promise<SalesOrderStockDto | null> {
    try {
      const query = `
        SELECT 
          *
        FROM APPS.XTD_ONT_SALES_ORDER_STOCK_V
        WHERE LINE_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      this.logger.error('Error fetching sales order stock by ID:', error);
      throw error;
    }
  }

  async countSalesOrderStock(
    queryDto: SalesOrderStockQueryDto = {},
  ): Promise<number> {
    try {
      const { FPPR_NUMBER, ITEM } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL
        FROM APPS.XTD_ONT_SALES_ORDER_STOCK_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (FPPR_NUMBER) {
        query += ` AND FPPR_NUMBER = :${paramIndex}`;
        params.push(FPPR_NUMBER);
        paramIndex++;
      }

      if (ITEM) {
        query += ` AND UPPER(ITEM) LIKE UPPER(:${paramIndex})`;
        params.push(`%${ITEM}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting sales order stock:', error);
      throw error;
    }
  }
}
