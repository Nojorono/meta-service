import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { MtlTrxListsDto, MtlTrxListsQueryDto } from '../dtos/mtl-trx-lists.dtos';

@Injectable()
export class MtlTrxListsService {
  private readonly logger = new Logger(MtlTrxListsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAll(query: MtlTrxListsQueryDto): Promise<{ data: MtlTrxListsDto[]; total: number }> {
    const {
      TRANSACTION_ID,
      ORGANIZATION_ID,
      ORGANIZATION_CODE,
      INVENTORY_ITEM_ID,
      ITEM_CODE,
      TRANSACTION_TYPE_ID,
      TRANSACTION_TYPE_NAME,
      SUBINVENTORY_CODE,
      page = 1,
      limit = 10,
    } = query;
    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM APPS.XTD_INV_MTL_TRX_LISTS_V WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;
    if (TRANSACTION_ID) {
      sql += ` AND TRANSACTION_ID = :${paramIndex}`;
      params.push(TRANSACTION_ID);
      paramIndex++;
    }
    if (ORGANIZATION_ID) {
      sql += ` AND ORGANIZATION_ID = :${paramIndex}`;
      params.push(ORGANIZATION_ID);
      paramIndex++;
    }
    if (ORGANIZATION_CODE) {
      sql += ` AND ORGANIZATION_CODE = :${paramIndex}`;
      params.push(ORGANIZATION_CODE);
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
    if (TRANSACTION_TYPE_ID) {
      sql += ` AND TRANSACTION_TYPE_ID = :${paramIndex}`;
      params.push(TRANSACTION_TYPE_ID);
      paramIndex++;
    }
    if (TRANSACTION_TYPE_NAME) {
      sql += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
      params.push(`%${TRANSACTION_TYPE_NAME}%`);
      paramIndex++;
    }
    if (SUBINVENTORY_CODE) {
      sql += ` AND SUBINVENTORY_CODE = :${paramIndex}`;
      params.push(SUBINVENTORY_CODE);
      paramIndex++;
    }
    // Pagination
    sql += ` ORDER BY TRANSACTION_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
    params.push(offset, limit);
    const result = await this.oracleService.executeQuery(sql, params);
    // Get total count
    let countSql = `SELECT COUNT(*) AS TOTAL FROM APPS.XTD_INV_MTL_TRX_LISTS_V WHERE 1=1`;
    const countParams: any[] = [];
    let countIndex = 1;
    if (TRANSACTION_ID) {
      countSql += ` AND TRANSACTION_ID = :${countIndex}`;
      countParams.push(TRANSACTION_ID);
      countIndex++;
    }
    if (ORGANIZATION_ID) {
      countSql += ` AND ORGANIZATION_ID = :${countIndex}`;
      countParams.push(ORGANIZATION_ID);
      countIndex++;
    }
    if (ORGANIZATION_CODE) {
      countSql += ` AND ORGANIZATION_CODE = :${countIndex}`;
      countParams.push(ORGANIZATION_CODE);
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
    if (TRANSACTION_TYPE_ID) {
      countSql += ` AND TRANSACTION_TYPE_ID = :${countIndex}`;
      countParams.push(TRANSACTION_TYPE_ID);
      countIndex++;
    }
    if (TRANSACTION_TYPE_NAME) {
      countSql += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${countIndex})`;
      countParams.push(`%${TRANSACTION_TYPE_NAME}%`);
      countIndex++;
    }
    if (SUBINVENTORY_CODE) {
      countSql += ` AND SUBINVENTORY_CODE = :${countIndex}`;
      countParams.push(SUBINVENTORY_CODE);
      countIndex++;
    }
    const countResult = await this.oracleService.executeQuery(countSql, countParams);
    const total = countResult.rows[0]?.TOTAL || 0;
    return { data: result.rows, total };
  }

  async findOne(id: number): Promise<MtlTrxListsDto> {
    const sql = `SELECT * FROM APPS.XTD_INV_MTL_TRX_LISTS_V WHERE TRANSACTION_ID = :1`;
    const result = await this.oracleService.executeQuery(sql, [id]);
    if (!result.rows.length) {
      throw new Error(`Material transaction with ID ${id} not found`);
    }
    return result.rows[0];
  }
}
