import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CreateRcvReceiptDto } from '../dtos/rcv-receipt.dtos';

@Injectable()
export class RcvReceiptHeaderService {
  constructor(private readonly oracleService: OracleService) { }

  async create(payload: CreateRcvReceiptDto): Promise<void> {
    const headerSql = `
      INSERT INTO XTD_RCV_RECEIPT_HDR_IFACE (
        TRANSACTION_TYPE,
        SOURCE_SYSTEM,
        RECEIPT_SOURCE_CODE,
        SOURCE_HEADER_ID,
        DO_NUMBER,
        VENDOR_ID,
        VENDOR_SITE_ID,
        RSH_ATTRIBUTE1,
        RSH_ATTRIBUTE2,
        RSH_ATTRIBUTE3,
        RECEIPT_NUMBER,
        TOTAL_LINES
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12
      )
    `;

    const headerParams = [
      payload.TRANSACTION_TYPE,
      payload.SOURCE_SYSTEM,
      payload.RECEIPT_SOURCE_CODE,
      payload.SOURCE_HEADER_ID,
      payload.DO_NUMBER ?? null,
      payload.VENDOR_ID,
      payload.VENDOR_SITE_ID,
      payload.RSH_ATTRIBUTE1 ?? null,
      payload.RSH_ATTRIBUTE2 ?? null,
      payload.RSH_ATTRIBUTE3 ?? null,
      payload.RECEIPT_NUMBER,
      payload.TOTAL_LINES,
    ];

    await this.oracleService.executeQuery(headerSql, headerParams);
  }

  async findLatestBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<Record<string, any> | null> {
    const sql = `
      SELECT
        *
      FROM XTD_RCV_RECEIPT_HDR_IFACE
      WHERE SOURCE_HEADER_ID = :1
      ORDER BY CREATION_DATE DESC
      FETCH FIRST 1 ROWS ONLY
    `;

    const result = await this.oracleService.executeQuery(sql, [sourceHeaderId]);
    return result.rows?.[0] || null;
  }
}
