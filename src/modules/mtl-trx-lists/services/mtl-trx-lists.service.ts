import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  MtlTrxListsDto,
  MtlTrxListsQueryDto,
} from '../dtos/mtl-trx-lists.dtos';

@Injectable()
export class MtlTrxListsService {
  private readonly logger = new Logger(MtlTrxListsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAll(query: MtlTrxListsQueryDto): Promise<MtlTrxListsDto[]> {
    const {
      TRANSACTION_TYPE_NAME,
      FPPR_NUMBER,
      REFERENCE_NUMBER,
      ITEM_CODE,
      ITEM_NUMBER,
      ITEM_DESCRIPTION,
      ORGANIZATION_ID,
      ORGANIZATION_CODE,
      ITEM,
      SUBINVENTORY,
      LOCATOR,
      TRANSACTION_DATE,
      UOM,
      QUANTITY,
      TRANSACT_BY,
      page = 1,
      limit = 10,
    } = query;

    const offset = (page - 1) * limit;
    let sql = `SELECT * FROM APPS.XTD_INV_MTL_TRX_LISTS_V WHERE 1=1`;
    const params: any[] = [];
    let paramIndex = 1;

    if (TRANSACTION_TYPE_NAME) {
      sql += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
      params.push(`%${TRANSACTION_TYPE_NAME}%`);
      paramIndex++;
    }

    if (FPPR_NUMBER) {
      sql += ` AND UPPER(FPPR_NUMBER) LIKE UPPER(:${paramIndex})`;
      params.push(`%${FPPR_NUMBER}%`);
      paramIndex++;
    }

    if (REFERENCE_NUMBER) {
      sql += ` AND UPPER(REFERENCE_NUMBER) LIKE UPPER(:${paramIndex})`;
      params.push(`%${REFERENCE_NUMBER}%`);
      paramIndex++;
    }

    if (ITEM_CODE) {
      sql += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${paramIndex})`;
      params.push(`%${ITEM_CODE}%`);
      paramIndex++;
    }

    if (ITEM_NUMBER) {
      sql += ` AND UPPER(ITEM_NUMBER) LIKE UPPER(:${paramIndex})`;
      params.push(`%${ITEM_NUMBER}%`);
      paramIndex++;
    }

    if (ITEM_DESCRIPTION) {
      sql += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(:${paramIndex})`;
      params.push(`%${ITEM_DESCRIPTION}%`);
      paramIndex++;
    }

    if (ORGANIZATION_ID) {
      sql += ` AND ORGANIZATION_ID = :${paramIndex}`;
      params.push(ORGANIZATION_ID);
      paramIndex++;
    }

    if (ORGANIZATION_CODE) {
      sql += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
      params.push(ORGANIZATION_CODE);
      paramIndex++;
    }

    if (ITEM) {
      sql += ` AND UPPER(ITEM) LIKE UPPER(:${paramIndex})`;
      params.push(`%${ITEM}%`);
      paramIndex++;
    }

    if (SUBINVENTORY) {
      sql += ` AND UPPER(SUBINVENTORY) = UPPER(:${paramIndex})`;
      params.push(SUBINVENTORY);
      paramIndex++;
    }

    if (LOCATOR) {
      sql += ` AND UPPER(LOCATOR) LIKE UPPER(:${paramIndex})`;
      params.push(`%${LOCATOR}%`);
      paramIndex++;
    }

    if (TRANSACTION_DATE) {
      sql += ` AND TRANSACTION_DATE >= :${paramIndex}`;
      params.push(TRANSACTION_DATE);
      paramIndex++;
    }

    if (UOM) {
      sql += ` AND UPPER(UOM) = UPPER(:${paramIndex})`;
      params.push(UOM);
      paramIndex++;
    }

    if (QUANTITY) {
      sql += ` AND QUANTITY = :${paramIndex}`;
      params.push(QUANTITY);
      paramIndex++;
    }

    if (TRANSACT_BY) {
      sql += ` AND UPPER(TRANSACT_BY) LIKE UPPER(:${paramIndex})`;
      params.push(`%${TRANSACT_BY}%`);
      paramIndex++;
    }

    // Pagination
    sql += ` ORDER BY TRANSACTION_DATE DESC OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
    params.push(offset, limit);

    const result = await this.oracleService.executeQuery(sql, params);

    this.logger.log(`Found ${result.rows.length} material transactions`);
    return result.rows;
  }

  async findOne(id: number): Promise<MtlTrxListsDto> {
    try {
      const sql = `SELECT * FROM APPS.XTD_INV_MTL_TRX_LISTS_V WHERE TRANSACTION_ID = :1`;
      const result = await this.oracleService.executeQuery(sql, [id]);

      if (!result.rows.length) {
        throw new Error(`Material transaction with ID ${id} not found`);
      }

      this.logger.log(`Found material transaction with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(
        `Error fetching material transaction with ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async countMtlTrxLists(query: MtlTrxListsQueryDto = {}): Promise<number> {
    try {
      const {
        TRANSACTION_TYPE_NAME,
        FPPR_NUMBER,
        REFERENCE_NUMBER,
        ITEM_CODE,
        ITEM_NUMBER,
        ITEM_DESCRIPTION,
        ORGANIZATION_ID,
        ORGANIZATION_CODE,
        ITEM,
        SUBINVENTORY,
        LOCATOR,
        TRANSACTION_DATE,
        UOM,
        QUANTITY,
        TRANSACT_BY,
      } = query;

      let countSql = `SELECT COUNT(*) AS TOTAL FROM APPS.XTD_INV_MTL_TRX_LISTS_V WHERE 1=1`;
      const countParams: any[] = [];
      let countIndex = 1;

      if (TRANSACTION_TYPE_NAME) {
        countSql += ` AND UPPER(TRANSACTION_TYPE_NAME) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${TRANSACTION_TYPE_NAME}%`);
        countIndex++;
      }

      if (FPPR_NUMBER) {
        countSql += ` AND UPPER(FPPR_NUMBER) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${FPPR_NUMBER}%`);
        countIndex++;
      }

      if (REFERENCE_NUMBER) {
        countSql += ` AND UPPER(REFERENCE_NUMBER) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${REFERENCE_NUMBER}%`);
        countIndex++;
      }

      if (ITEM_CODE) {
        countSql += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${ITEM_CODE}%`);
        countIndex++;
      }

      if (ITEM_NUMBER) {
        countSql += ` AND UPPER(ITEM_NUMBER) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${ITEM_NUMBER}%`);
        countIndex++;
      }

      if (ITEM_DESCRIPTION) {
        countSql += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${ITEM_DESCRIPTION}%`);
        countIndex++;
      }

      if (ORGANIZATION_ID) {
        countSql += ` AND ORGANIZATION_ID = :${countIndex}`;
        countParams.push(ORGANIZATION_ID);
        countIndex++;
      }

      if (ORGANIZATION_CODE) {
        countSql += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${countIndex})`;
        countParams.push(ORGANIZATION_CODE);
        countIndex++;
      }

      if (ITEM) {
        countSql += ` AND UPPER(ITEM) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${ITEM}%`);
        countIndex++;
      }

      if (SUBINVENTORY) {
        countSql += ` AND UPPER(SUBINVENTORY) = UPPER(:${countIndex})`;
        countParams.push(SUBINVENTORY);
        countIndex++;
      }

      if (LOCATOR) {
        countSql += ` AND UPPER(LOCATOR) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${LOCATOR}%`);
        countIndex++;
      }

      if (TRANSACTION_DATE) {
        countSql += ` AND TRANSACTION_DATE >= :${countIndex}`;
        countParams.push(TRANSACTION_DATE);
        countIndex++;
      }

      if (UOM) {
        countSql += ` AND UPPER(UOM) = UPPER(:${countIndex})`;
        countParams.push(UOM);
        countIndex++;
      }

      if (QUANTITY) {
        countSql += ` AND QUANTITY = :${countIndex}`;
        countParams.push(QUANTITY);
        countIndex++;
      }

      if (TRANSACT_BY) {
        countSql += ` AND UPPER(TRANSACT_BY) LIKE UPPER(:${countIndex})`;
        countParams.push(`%${TRANSACT_BY}%`);
        countIndex++;
      }

      const result = await this.oracleService.executeQuery(
        countSql,
        countParams,
      );
      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting material transactions:', error);
      throw error;
    }
  }
}
