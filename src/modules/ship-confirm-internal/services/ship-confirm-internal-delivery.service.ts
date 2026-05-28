import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  CreateShipConfirmInternalDto,
  CreateShipConfirmPickReleaseLineDto,
  ShipConfirmInternalTransactionType,
} from '../dtos/ship-confirm-internal.dtos';

@Injectable()
export class ShipConfirmInternalDeliveryService {
  constructor(private readonly oracleService: OracleService) { }

  async createMutasi(payload: CreateShipConfirmInternalDto): Promise<void> {
    const sql = `
      INSERT INTO XTD_WSH_DELIVERIES_TRX_IFACE (
        TRANSACTION_TYPE,
        SOURCE_SYSTEM,
        SOURCE_HEADER_ID,
        ISO_HEADER_ID,
        DELIVERY_ATTRIBUTE_CATEGORY,
        DELIVERY_ATTRIBUTE6,
        DELIVERY_ATTRIBUTE7,
        DELIVERY_ATTRIBUTE8,
        DELIVERY_ATTRIBUTE9,
        DELIVERY_ATTRIBUTE10,
        DELIVERY_ATTRIBUTE11,
        DELIVERY_ATTRIBUTE12,
        DELIVERY_ATTRIBUTE13
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13
      )
    `;

    const params = [
      payload.TRANSACTION_TYPE,
      payload.SOURCE_SYSTEM,
      payload.SOURCE_HEADER_ID,
      payload.ISO_HEADER_ID,
      payload.DELIVERY_ATTRIBUTE_CATEGORY ?? null,
      payload.DELIVERY_ATTRIBUTE6 ?? null,
      payload.DELIVERY_ATTRIBUTE7 ?? null,
      payload.DELIVERY_ATTRIBUTE8 ?? null,
      payload.DELIVERY_ATTRIBUTE9 ?? null,
      payload.DELIVERY_ATTRIBUTE10 ?? null,
      payload.DELIVERY_ATTRIBUTE11 ?? null,
      payload.DELIVERY_ATTRIBUTE12 ?? null,
      payload.DELIVERY_ATTRIBUTE13 ?? null,
    ];

    await this.oracleService.executeQuery(sql, params);
  }

  async createPickRelease(
    payload: CreateShipConfirmInternalDto,
    line: CreateShipConfirmPickReleaseLineDto,
    sourceHeaderId: string,
  ): Promise<void> {
    const sql = `
      INSERT INTO XTD_WSH_DELIVERIES_TRX_IFACE (
        TRANSACTION_TYPE,
        SOURCE_SYSTEM,
        SOURCE_HEADER_ID,
        SOURCE_LINE_ID,
        ISO_HEADER_ID,
        ISO_LINE_ID,
        ISO_INVENTORY_ITEM_ID,
        ISO_ORGANIZATION_ID,
        DELIVERY_ATTRIBUTE_CATEGORY,
        DELIVERY_ATTRIBUTE6,
        DELIVERY_ATTRIBUTE7,
        DELIVERY_ATTRIBUTE8,
        DELIVERY_ATTRIBUTE9,
        DELIVERY_ATTRIBUTE10,
        DELIVERY_ATTRIBUTE11,
        DELIVERY_ATTRIBUTE12,
        DELIVERY_ATTRIBUTE13
      ) VALUES (
        :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17
      )
    `;

    const params = [
      payload.TRANSACTION_TYPE,
      payload.SOURCE_SYSTEM,
      sourceHeaderId,
      line.SOURCE_LINE_ID,
      line.ISO_HEADER_ID,
      line.ISO_LINE_ID,
      line.ISO_INVENTORY_ITEM_ID,
      line.ISO_ORGANIZATION_ID,
      payload.DELIVERY_ATTRIBUTE_CATEGORY ?? null,
      payload.DELIVERY_ATTRIBUTE6 ?? null,
      payload.DELIVERY_ATTRIBUTE7 ?? null,
      payload.DELIVERY_ATTRIBUTE8 ?? null,
      payload.DELIVERY_ATTRIBUTE9 ?? null,
      payload.DELIVERY_ATTRIBUTE10 ?? null,
      payload.DELIVERY_ATTRIBUTE11 ?? null,
      payload.DELIVERY_ATTRIBUTE12 ?? null,
      payload.DELIVERY_ATTRIBUTE13 ?? null,
    ];

    await this.oracleService.executeQuery(sql, params);
  }

  async createSubdistShipConfirm(
    payload: CreateShipConfirmInternalDto,
    line: CreateShipConfirmPickReleaseLineDto,
  ): Promise<void> {
    const sql = `
      INSERT INTO XTD_WSH_DELIVERIES_TRX_IFACE (
        TRANSACTION_TYPE,
        SOURCE_SYSTEM,
        SOURCE_HEADER_ID,
        DELIVERY_ID,
        DELIVERY_NAME,
        SHIPPED_QUANTITY
      ) VALUES (
        :1, :2, :3, :4, :5, :6
      )
    `;

    const params = [
      payload.TRANSACTION_TYPE,
      payload.SOURCE_SYSTEM,
      payload.SOURCE_HEADER_ID,
      line.DELIVERY_ID,
      line.DELIVERY_NAME,
      line.SHIPPED_QUANTITY,
    ];

    await this.oracleService.executeQuery(sql, params);
  }

  async create(payload: CreateShipConfirmInternalDto): Promise<void> {
    switch (payload.TRANSACTION_TYPE) {
      case ShipConfirmInternalTransactionType.OUTBOUND_GS_MUTASI_SO_INTERNAL:
        await this.createMutasi(payload);
        break;

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE:
        for (const line of payload.LINES || []) {
          await this.createPickRelease(
            payload,
            line,
            payload.SOURCE_HEADER_ID,
          );
        }
        break;

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM:
        for (const line of payload.LINES || []) {
          await this.createSubdistShipConfirm(payload, line);
        }
        break;

      default:
        throw new Error(`Unsupported TRANSACTION_TYPE: ${payload.TRANSACTION_TYPE}`);
    }
  }

  async find(criteria: {
    source_header_id?: string;
    iso_header_id?: number;
  }): Promise<Record<string, any>[]> {
    let sql = `
      SELECT *
      FROM XTD_WSH_DELIVERIES_TRX_IFACE
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (criteria.source_header_id) {
      sql += ` AND SOURCE_HEADER_ID = :${paramIndex}`;
      params.push(criteria.source_header_id);
      paramIndex++;
    }

    if (criteria.iso_header_id != null) {
      sql += ` AND ISO_HEADER_ID = :${paramIndex}`;
      params.push(criteria.iso_header_id);
      paramIndex++;
    }

    sql += ` ORDER BY CREATION_DATE DESC`;

    const result = await this.oracleService.executeQuery(sql, params);
    return result.rows || [];
  }
}
