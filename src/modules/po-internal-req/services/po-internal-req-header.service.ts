import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CreatePoInternalReqDto } from '../dtos/po-internal-req.dtos';

@Injectable()
export class PoInternalReqHeaderService {
  constructor(private readonly oracleService: OracleService) { }

  async create(payload: CreatePoInternalReqDto): Promise<void> {
    const headerSql = `
      INSERT INTO XTD_PO_INTERNAL_REQ_HDR_IFACE (
        TRANSACTION_TYPE,
        SOURCE_CODE,
        SOURCE_HEADER_ID,
        NEED_BY_DATE,
        PREPARER_NUMBER,
        PREPARER_ID,
        REQUESTOR_NUMBER,
        REQUESTOR_ID,
        ORG_NAME,
        ORG_ID,
        IO_SOURCE_NAME,
        IO_SOURCE_ID,
        IO_DEST_NAME,
        TOTAL_LINES,
        IO_DEST_ID,
        HEADER_ATTRIBUTE_CATEGORY,
        HEADER_ATTRIBUTE7
      ) VALUES (
        :1, :2, :3, TO_DATE(SUBSTR(:4, 1, 10), 'YYYY-MM-DD'), :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17
      )
    `;

    const headerParams = [
      payload.TRANSACTION_TYPE,
      payload.SOURCE_CODE,
      payload.SOURCE_HEADER_ID,
      payload.NEED_BY_DATE,
      payload.PREPARER_NUMBER,
      payload.PREPARER_ID ?? null,
      payload.REQUESTOR_NUMBER,
      payload.REQUESTOR_ID ?? null,
      payload.ORG_NAME,
      payload.ORG_ID ?? null,
      payload.IO_SOURCE_NAME,
      payload.IO_SOURCE_ID ?? null,
      payload.IO_DEST_NAME,
      payload.TOTAL_LINES,
      payload.IO_DEST_ID ?? null,
      payload.HEADER_ATTRIBUTE_CATEGORY,
      payload.HEADER_ATTRIBUTE7,
    ];

    await this.oracleService.executeQuery(headerSql, headerParams);
  }


  async findLatestBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<Record<string, any> | null> {
    const sql = `
      SELECT
        *
      FROM XTD_PO_INTERNAL_REQ_HDR_IFACE
      WHERE SOURCE_HEADER_ID = :1
      ORDER BY CREATION_DATE DESC
      FETCH FIRST 1 ROWS ONLY
    `;

    const result = await this.oracleService.executeQuery(sql, [sourceHeaderId]);
    return result.rows?.[0] || null;
  }
}
