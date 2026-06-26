import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CreateMoveOrderWmsDto } from '../dtos/move-order-wms.dtos';

@Injectable()
export class MoveOrderWmsHeaderService {
  constructor(private readonly oracleService: OracleService) {}

  async create(payload: CreateMoveOrderWmsDto): Promise<void> {
    const headerSql = `
      INSERT INTO XTD_INV_MO_HEADERS_IFACE (
        REQUEST_NUMBER,
        TRANSACTION_TYPE_ID,
        MOVE_ORDER_TYPE,
        ORGANIZATION_ID,
        DATE_REQUIRED,
        FROM_SUBINVENTORY_CODE,
        TO_SUBINVENTORY_CODE,
        HEADER_STATUS,
        STATUS_DATE,
        ATTRIBUTE_CATEGORY,
        ATTRIBUTE7,
        ATTRIBUTE8,
        ATTRIBUTE9,
        ATTRIBUTE10,
        ATTRIBUTE11,
        ATTRIBUTE12,
        ATTRIBUTE13,
        ATTRIBUTE14,
        OPERATION,
        DB_FLAG,
        SOURCE_SYSTEM,
        SOURCE_HEADER_ID,
        IFACE_STATUS,
        IFACE_MODE,
        TOTAL_LINES
      ) VALUES (
        :1, :2, :3, :4,
        TO_DATE(SUBSTR(:5, 1, 10), 'YYYY-MM-DD'), :6, :7,
        :8, TO_DATE(SUBSTR(:9, 1, 10), 'YYYY-MM-DD'), :10,
        :11, :12, :13, :14, :15, :16, :17, :18,
        :19, :20, :21, :22, :23, :24, :25
      )
    `;

    const headerParams = [
      payload.REQUEST_NUMBER,
      payload.TRANSACTION_TYPE_ID,
      payload.MOVE_ORDER_TYPE,
      payload.ORGANIZATION_ID,
      payload.DATE_REQUIRED,
      payload.FROM_SUBINVENTORY_CODE,
      payload.TO_SUBINVENTORY_CODE,
      payload.HEADER_STATUS,
      payload.STATUS_DATE,
      payload.ATTRIBUTE_CATEGORY ?? null,
      payload.ATTRIBUTE7 ?? null,
      payload.ATTRIBUTE8 ?? null,
      payload.ATTRIBUTE9 ?? null,
      payload.ATTRIBUTE10 ?? null,
      payload.ATTRIBUTE11 ?? null,
      payload.ATTRIBUTE12 ?? null,
      payload.ATTRIBUTE13 ?? null,
      payload.ATTRIBUTE14 ?? null,
      payload.OPERATION ?? 'CREATE',
      payload.DB_FLAG ?? 'T',
      payload.SOURCE_SYSTEM,
      payload.SOURCE_HEADER_ID,
      payload.IFACE_STATUS ?? 'READY',
      payload.IFACE_MODE ?? 'MOVE_ORDER',
      payload.TOTAL_LINES,
    ];

    await this.oracleService.executeQuery(headerSql, headerParams);
  }

  async findLatestBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<Record<string, any> | null> {
    const sql = `
      SELECT *
      FROM XTD_INV_MO_HEADERS_IFACE
      WHERE SOURCE_HEADER_ID = :1
      ORDER BY CREATION_DATE DESC
      FETCH FIRST 1 ROWS ONLY
    `;

    const result = await this.oracleService.executeQuery(sql, [sourceHeaderId]);
    return result.rows?.[0] || null;
  }
}
