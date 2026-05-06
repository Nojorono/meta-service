import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CreateRcvReceiptLinesDto } from '../dtos/rcv-receipt-lines.dtos';

@Injectable()
export class RcvReceiptLinesService {
  constructor(private readonly oracleService: OracleService) { }

  /**
   * Inserts lines for one receipt. SOURCE_HEADER_ID is always taken from
   * sourceHeaderId so batch payloads cannot map lines to the wrong header.
   */
  async createMany(
    lines: CreateRcvReceiptLinesDto[],
    sourceHeaderId: string,
  ): Promise<void> {
    const lineSql = `
      INSERT INTO XTD_RCV_RECEIPT_LNS_IFACE (
        SOURCE_LINE_ID,
        SOURCE_HEADER_ID,
        PO_NUMBER,
        PO_LINE_NUMBER,
        ISO_NUMBER,
        ISO_LINE_NUMBER,
        INVENTORY_ITEM_ID,
        UOM_CODE,
        QUANTITY,
        SUBINVENTORY,
        LOCATOR_ID,
        QUANTITY_SELISIH,
        SUBINVENTORY_SELISIH,
        LOCATOR_ID_SELISIH
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14
      )
    `;

    for (const line of lines || []) {
      const lineParams = [
        line.SOURCE_LINE_ID,
        sourceHeaderId,
        line.PO_NUMBER ?? null,
        line.PO_LINE_NUMBER ?? null,
        line.ISO_NUMBER ?? null,
        line.ISO_LINE_NUMBER ?? null,
        line.INVENTORY_ITEM_ID,
        line.UOM_CODE,
        line.QUANTITY,
        line.SUBINVENTORY,
        line.LOCATOR_ID,
        line.QUANTITY_SELISIH ?? null,
        line.SUBINVENTORY_SELISIH ?? null,
        line.LOCATOR_ID_SELISIH ?? null,
      ];
      await this.oracleService.executeQuery(lineSql, lineParams);
    }
  }

  async findBySourceHeaderId(sourceHeaderId: string): Promise<Record<string, any>[]> {
    const sql = `
      SELECT
        *
      FROM XTD_RCV_RECEIPT_LNS_IFACE
      WHERE SOURCE_HEADER_ID = :1
      ORDER BY CREATION_DATE DESC
    `;

    const result = await this.oracleService.executeQuery(sql, [sourceHeaderId]);
    return result.rows || [];
  }

  async findByIfaceHeaderId(ifaceHeaderId: number): Promise<Record<string, any>[]> {
    const sql = `
      SELECT
        *
      FROM XTD_RCV_RECEIPT_LNS_IFACE
      WHERE IFACE_HEADER_ID = :1
      ORDER BY CREATION_DATE DESC
    `;

    const result = await this.oracleService.executeQuery(sql, [ifaceHeaderId]);
    return result.rows || [];
  }


}
