import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { SalesOrderQueryDto } from '../dtos/sales-order.dtos';

@Injectable()
export class SalesOrderService {
  private readonly logger = new Logger(SalesOrderService.name);
  constructor(private readonly oracleService: OracleService) { }

  async findAll(
    query: SalesOrderQueryDto = {},
  ): Promise<{ data: any[]; total: number }> {
    const { order_number, page = 1, limit = 10 } = query;
    let sql = `
      SELECT so.HEADER_ID, so.SO_TYPE, so.ORG_ID, hou.NAME as ORG_NAME, so.STATUS, so.ORGANIZATION_ID, so.TRANSACTION_TYPE, so.ORDER_NUMBER,
        so.ORGANIZATION_ID_FROM, so.SUBINVENTORY_FROM, so.ORDERED_DATE, so.ORGANIZATION_ID_TO, so.SUBINVENTORY_TO,
        so.LOCATION_BILL, so.LOCATON_SHIP, so.INVOICE_TO_ADDRESS1, so.CREATED_BY, so.CREATED_DATE,
        so.INVENTORY_ITEM_ID, so.ITEM_DESC, so.ORDERED_QUANTITY, so.ORDER_QUANTITY_UOM, so.SHIPPING_QUANTITY, so.SHIPPING_QUANTITY_UOM,
        si.ITEM_CODE, si.ITEM_NUMBER, si.ITEM_DESCRIPTION
      FROM APPS.XTD_ONT_SO_OPEN_V so
      LEFT JOIN (
        SELECT ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID
        FROM APPS.XTD_INV_SALES_ITEMS_V
        GROUP BY ITEM_CODE, ITEM_NUMBER, ITEM_DESCRIPTION, INVENTORY_ITEM_ID
      ) si ON si.INVENTORY_ITEM_ID = so.INVENTORY_ITEM_ID
       LEFT JOIN APPS.HR_ORGANIZATION_UNITS hou ON hou.ORGANIZATION_ID = so.ORG_ID  
      WHERE 1=1
    `;
    const params: any[] = [];
    let paramIndex = 1;
    if (order_number) {
      sql += ` AND so.ORDER_NUMBER = :${paramIndex}`;
      params.push(order_number);
      paramIndex++;
    }
    // Pagination
    const offset = (page - 1) * limit;
    sql += ` ORDER BY so.HEADER_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
    params.push(offset);
    params.push(limit);
    const result = await this.oracleService.executeQuery(sql, params);
    // Get total count
    let countSql = `SELECT COUNT(*) AS TOTAL FROM APPS.XTD_ONT_SO_OPEN_V so WHERE 1=1`;
    const countParams: any[] = [];
    let countIndex = 1;
    if (order_number) {
      countSql += ` AND so.ORDER_NUMBER = :${countIndex}`;
      countParams.push(order_number);
      countIndex++;
    }
    const countResult = await this.oracleService.executeQuery(
      countSql,
      countParams,
    );
    const total = countResult.rows[0]?.TOTAL || 0;

    // Grouping and formatting response
    const grouped: Record<string, any> = {};
    for (const row of result.rows) {
      const {
        HEADER_ID,
        SO_TYPE,
        ORG_ID,
        ORG_NAME,
        STATUS,
        ORGANIZATION_ID,
        TRANSACTION_TYPE,
        ORDER_NUMBER,
        ORGANIZATION_ID_FROM,
        SUBINVENTORY_FROM,
        ORDERED_DATE,
        ORGANIZATION_ID_TO,
        SUBINVENTORY_TO,
        LOCATION_BILL,
        LOCATON_SHIP,
        INVOICE_TO_ADDRESS1,
        CREATED_BY,
        CREATED_DATE,
      } = row;
      if (!grouped[HEADER_ID]) {
        grouped[HEADER_ID] = {
          HEADER_ID,
          SO_TYPE,
          ORG_ID,
          ORG_NAME,
          STATUS,
          ORGANIZATION_ID,
          TRANSACTION_TYPE,
          ORDER_NUMBER,
          ORGANIZATION_ID_FROM,
          SUBINVENTORY_FROM,
          ORDERED_DATE,
          ORGANIZATION_ID_TO,
          SUBINVENTORY_TO,
          LOCATION_BILL,
          LOCATON_SHIP,
          INVOICE_TO_ADDRESS1,
          CREATED_BY,
          CREATED_DATE,
          ITEM: [],
        };
      }
      grouped[HEADER_ID].ITEM.push({
        INVENTORY_ITEM_ID: row.INVENTORY_ITEM_ID,
        ITEM_CODE: row.ITEM_CODE,
        ITEM_NUMBER: row.ITEM_NUMBER,
        ITEM_DESC: row.ITEM_DESC || row.ITEM_DESCRIPTION,
        ORDERED_QUANTITY: row.ORDERED_QUANTITY,
        ORDER_QUANTITY_UOM: row.ORDER_QUANTITY_UOM,
        SHIPPING_QUANTITY: row.SHIPPING_QUANTITY,
        SHIPPING_QUANTITY_UOM: row.SHIPPING_QUANTITY_UOM,
      });
    }
    const data = Object.values(grouped).sort(
      (a, b) => a.HEADER_ID - b.HEADER_ID,
    );
    return { data, total };
  }
}
