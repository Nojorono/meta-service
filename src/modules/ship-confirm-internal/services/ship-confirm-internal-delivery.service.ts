import { Injectable } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  CreateShipConfirmInternalDto,
  CreateShipConfirmPickReleaseLineDto,
  ShipConfirmInternalTransactionType,
} from '../dtos/ship-confirm-internal.dtos';

@Injectable()
export class ShipConfirmInternalDeliveryService {
  constructor(private readonly oracleService: OracleService) {}

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
      line.DELIVERY_ATTRIBUTE_CATEGORY ?? null,
      line.DELIVERY_ATTRIBUTE6 ?? null,
      line.DELIVERY_ATTRIBUTE7 ?? null,
      line.DELIVERY_ATTRIBUTE8 ?? null,
      line.DELIVERY_ATTRIBUTE9 ?? null,
      line.DELIVERY_ATTRIBUTE10 ?? null,
      line.DELIVERY_ATTRIBUTE11 ?? null,
      line.DELIVERY_ATTRIBUTE12 ?? null,
      line.DELIVERY_ATTRIBUTE13 ?? null,
    ];

    await this.oracleService.executeQuery(sql, params);
  }

  async createSubdistShipConfirm(
    payload: CreateShipConfirmInternalDto,
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
      payload.DELIVERY_ID,
      payload.DELIVERY_NAME,
      payload.SHIPPED_QUANTITY,
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
        await this.createSubdistShipConfirm(payload);
        break;

      default:
        throw new Error(`Unsupported TRANSACTION_TYPE: ${payload.TRANSACTION_TYPE}`);
    }
  }

  async findBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<Record<string, any>[]> {
    const sql = `
      SELECT *
      FROM XTD_WSH_DELIVERIES_TRX_IFACE
      WHERE SOURCE_HEADER_ID = :1
      ORDER BY CREATION_DATE DESC
    `;

    const result = await this.oracleService.executeQuery(sql, [sourceHeaderId]);
    return result.rows || [];
  }
}
