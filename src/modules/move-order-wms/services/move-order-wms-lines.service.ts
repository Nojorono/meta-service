import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CreateMoveOrderWmsLinesDto } from '../dtos/move-order-wms-lines.dtos';

@Injectable()
export class MoveOrderWmsLinesService {
  constructor(private readonly oracleService: OracleService) {}

  async createMany(
    lines: CreateMoveOrderWmsLinesDto[],
    sourceHeaderId: string,
    sourceSystem: string,
  ): Promise<void> {
    const lineSql = `
      INSERT INTO XTD_INV_MO_LINES_IFACE (
        LINE_NUMBER,
        ORGANIZATION_ID,
        INVENTORY_ITEM_ID,
        FROM_SUBINVENTORY_CODE,
        FROM_LOCATOR_ID,
        TO_SUBINVENTORY_CODE,
        TO_LOCATOR_ID,
        UOM_CODE,
        QUANTITY,
        DATE_REQUIRED,
        TRANSACTION_SOURCE_TYPE_ID,
        LINE_STATUS,
        STATUS_DATE,
        OPERATION,
        DB_FLAG,
        SOURCE_SYSTEM,
        SOURCE_BATCH_ID,
        SOURCE_HEADER_ID,
        SOURCE_LINE_ID,
        IFACE_STATUS
      ) VALUES (
        :1, :2, :3, :4, :5,
        :6, :7, :8, :9, TO_DATE(SUBSTR(:10, 1, 10), 'YYYY-MM-DD'),
        :11, :12, TO_DATE(SUBSTR(:13, 1, 10), 'YYYY-MM-DD'), :14, :15,
        :16, :17, :18, :19, :20
      )
    `;

    for (const line of lines || []) {
      const lineParams = [
        line.LINE_NUMBER,
        line.ORGANIZATION_ID,
        line.INVENTORY_ITEM_ID,
        line.FROM_SUBINVENTORY_CODE,
        line.FROM_LOCATOR_ID ?? null,
        line.TO_SUBINVENTORY_CODE,
        line.TO_LOCATOR_ID ?? null,
        line.UOM_CODE,
        line.QUANTITY,
        line.DATE_REQUIRED,
        line.TRANSACTION_SOURCE_TYPE_ID,
        line.LINE_STATUS,
        line.STATUS_DATE,
        line.OPERATION ?? 'CREATE',
        line.DB_FLAG ?? 'T',
        line.SOURCE_SYSTEM ?? sourceSystem,
        line.SOURCE_BATCH_ID ?? null,
        sourceHeaderId,
        line.SOURCE_LINE_ID ?? null,
        line.IFACE_STATUS ?? 'READY',
      ];

      await this.oracleService.executeQuery(lineSql, lineParams);
    }
  }

  async findBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<Record<string, any>[]> {
    const sql = `
      SELECT *
      FROM XTD_INV_MO_LINES_IFACE
      WHERE SOURCE_HEADER_ID = :1
      ORDER BY LINE_NUMBER ASC, CREATION_DATE DESC
    `;

    const result = await this.oracleService.executeQuery(sql, [sourceHeaderId]);
    return result.rows || [];
  }
}
