import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { SalesOrderStockDto, SalesOrderStockQueryDto } from '../dtos/sales-order-stock.dtos';

@Injectable()
export class SalesOrderStockService {
  private readonly logger = new Logger(SalesOrderStockService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAll(query: SalesOrderStockQueryDto): Promise<{ data: SalesOrderStockDto[]; total: number }> {
    const {
      HEADER_ID,
      ORDER_NUMBER,
      INVENTORY_ITEM_ID,
      ITEM_CODE,
      CUSTOMER_ID,
      CUSTOMER_NUMBER,
      FLOW_STATUS_CODE,
      OPEN_FLAG,
      page = 1,
      limit = 10,
    } = query;
    const offset = (page - 1) * limit;
    let sql = `
      SELECT * FROM APPS.XTD_ONT_SALES_ORDER_STOCK_V WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;
    if (HEADER_ID) {
      sql += ` AND HEADER_ID = :${paramIndex}`;
      params.push(HEADER_ID);
      paramIndex++;
    }
    if (ORDER_NUMBER) {
      sql += ` AND UPPER(ORDER_NUMBER) LIKE UPPER(:${paramIndex})`;
      params.push(`%${ORDER_NUMBER}%`);
      paramIndex++;
    }
    if (INVENTORY_ITEM_ID) {
      sql += ` AND INVENTORY_ITEM_ID = :${paramIndex}`;
      params.push(INVENTORY_ITEM_ID);
      paramIndex++;
    }
    if (ITEM_CODE) {
      sql += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${paramIndex})`;
      params.push(`%${ITEM_CODE}%`);
      paramIndex++;
    }
    if (CUSTOMER_ID) {
      sql += ` AND CUSTOMER_ID = :${paramIndex}`;
      params.push(CUSTOMER_ID);
      paramIndex++;
    }
    if (CUSTOMER_NUMBER) {
      sql += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${paramIndex})`;
      params.push(`%${CUSTOMER_NUMBER}%`);
      paramIndex++;
    }
    if (FLOW_STATUS_CODE) {
      sql += ` AND FLOW_STATUS_CODE = :${paramIndex}`;
      params.push(FLOW_STATUS_CODE);
      paramIndex++;
    }
    if (OPEN_FLAG) {
      sql += ` AND OPEN_FLAG = :${paramIndex}`;
      params.push(OPEN_FLAG);
      paramIndex++;
    }
    // Pagination
    sql += ` ORDER BY LINE_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
    params.push(offset, limit);
    const result = await this.oracleService.executeQuery(sql, params);
    // Get total count
    let countSql = `SELECT COUNT(*) AS TOTAL FROM APPS.XTD_ONT_SALES_ORDER_STOCK_V WHERE 1=1`;
    const countParams: any[] = [];
    let countIndex = 1;
    if (HEADER_ID) {
      countSql += ` AND HEADER_ID = :${countIndex}`;
      countParams.push(HEADER_ID);
      countIndex++;
    }
    if (ORDER_NUMBER) {
      countSql += ` AND UPPER(ORDER_NUMBER) LIKE UPPER(:${countIndex})`;
      countParams.push(`%${ORDER_NUMBER}%`);
      countIndex++;
    }
    if (INVENTORY_ITEM_ID) {
      countSql += ` AND INVENTORY_ITEM_ID = :${countIndex}`;
      countParams.push(INVENTORY_ITEM_ID);
      countIndex++;
    }
    if (ITEM_CODE) {
      countSql += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${countIndex})`;
      countParams.push(`%${ITEM_CODE}%`);
      countIndex++;
    }
    if (CUSTOMER_ID) {
      countSql += ` AND CUSTOMER_ID = :${countIndex}`;
      countParams.push(CUSTOMER_ID);
      countIndex++;
    }
    if (CUSTOMER_NUMBER) {
      countSql += ` AND UPPER(CUSTOMER_NUMBER) LIKE UPPER(:${countIndex})`;
      countParams.push(`%${CUSTOMER_NUMBER}%`);
      countIndex++;
    }
    if (FLOW_STATUS_CODE) {
      countSql += ` AND FLOW_STATUS_CODE = :${countIndex}`;
      countParams.push(FLOW_STATUS_CODE);
      countIndex++;
    }
    if (OPEN_FLAG) {
      countSql += ` AND OPEN_FLAG = :${countIndex}`;
      countParams.push(OPEN_FLAG);
      countIndex++;
    }
    const countResult = await this.oracleService.executeQuery(countSql, countParams);
    const total = countResult.rows[0]?.TOTAL || 0;
    return { data: result.rows, total };
  }

  async findOne(id: number): Promise<SalesOrderStockDto> {
    const sql = `SELECT * FROM APPS.XTD_ONT_SALES_ORDER_STOCK_V WHERE LINE_ID = :1`;
    const result = await this.oracleService.executeQuery(sql, [id]);
    if (!result.rows.length) {
      throw new Error(`Sales order stock with ID ${id} not found`);
    }
    return result.rows[0];
  }
}
