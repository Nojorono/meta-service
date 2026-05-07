import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CreatePoInternalReqLinesDto } from '../dtos/po-internal-req-lines.dtos';

@Injectable()
export class PoInternalReqLinesService {
  constructor(private readonly oracleService: OracleService) {}

  async createMany(
    lines: CreatePoInternalReqLinesDto[],
    sourceHeaderId: string,
  ): Promise<void> {
    const lineSql = `
      INSERT INTO XTD_PO_INTERNAL_REQ_LNS_IFACE (
        SOURCE_HEADER_ID,
        SOURCE_LINE_ID,
        INVENTORY_ITEM_ID,
        ITEM,
        QUANTITY,
        TRANSACTION_UOM
      ) VALUES (
        :1, :2, :3, :4, :5, :6
      )
    `;

    for (const line of lines || []) {
      const lineParams = [
        sourceHeaderId,
        line.SOURCE_LINE_ID,
        line.INVENTORY_ITEM_ID,
        line.ITEM,
        line.QUANTITY,
        line.TRANSACTION_UOM,
      ];
      await this.oracleService.executeQuery(lineSql, lineParams);
    }
  }
}
