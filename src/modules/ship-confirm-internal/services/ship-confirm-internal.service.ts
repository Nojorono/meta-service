import { Injectable, Logger } from '@nestjs/common';
import {
  CreateShipConfirmInternalDto,
  ShipConfirmInternalFindDto,
  ShipConfirmInternalResponseDto,
  ShipConfirmInternalTransactionType,
} from '../dtos/ship-confirm-internal.dtos';
import { ShipConfirmInternalDeliveryService } from './ship-confirm-internal-delivery.service';

@Injectable()
export class ShipConfirmInternalService {
  private readonly logger = new Logger(ShipConfirmInternalService.name);
  private readonly successStatus = 'S';

  constructor(
    private readonly shipConfirmInternalDeliveryService: ShipConfirmInternalDeliveryService,
  ) {}

  async create(
    payloads: CreateShipConfirmInternalDto[],
  ): Promise<ShipConfirmInternalResponseDto> {
    const list = payloads ?? [];

    if (list.length === 0) {
      return {
        status: true,
        message: 'No ship confirm internal data to insert',
        data: [],
      };
    }

    try {
      const data: ShipConfirmInternalResponseDto['data'][] = [];

      for (const payload of list) {
        this.assertPayloadShape(payload);

        const findCriteria = this.buildFindCriteriaFromPayload(payload);
        const validation = await this.validateBeforeCreate(findCriteria);

        if (validation.action === 'RETURN_EXISTING') {
          const existing = await this.find(findCriteria);
          if (!existing.status || existing.data == null) {
            return {
              status: false,
              message: existing.message,
              data: null,
            };
          }
          data.push(existing.data);
          continue;
        }

        await this.shipConfirmInternalDeliveryService.create(payload);

        const fetched = await this.find(findCriteria);
        if (!fetched.status || fetched.data == null) {
          return {
            status: false,
            message: fetched.message,
            data: null,
          };
        }
        data.push(fetched.data);
      }

      return {
        status: true,
        message: 'Ship confirm internal interface data inserted successfully',
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error inserting ship confirm internal interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error inserting ship confirm internal interface data: ${error.message}`,
        data: null,
      };
    }
  }

  async find(
    criteria: ShipConfirmInternalFindDto,
  ): Promise<ShipConfirmInternalResponseDto> {
    if (!criteria.source_header_id && criteria.iso_header_id == null) {
      return {
        status: false,
        message:
          'At least one of source_header_id or iso_header_id is required',
        data: null,
      };
    }

    try {
      const rows = await this.shipConfirmInternalDeliveryService.find(criteria);

      return this.formatRetrievedRows(
        rows,
        `No ship confirm internal data found for ${this.buildFindCriteriaLabel(criteria)}`,
      );
    } catch (error) {
      this.logger.error(
        `Error retrieving ship confirm internal interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error retrieving ship confirm internal interface data: ${error.message}`,
        data: null,
      };
    }
  }

  private buildFindCriteriaFromPayload(
    payload: CreateShipConfirmInternalDto,
  ): ShipConfirmInternalFindDto {
    const criteria: ShipConfirmInternalFindDto = {
      source_header_id: payload.SOURCE_HEADER_ID,
    };
    if (payload.ISO_HEADER_ID != null) {
      criteria.iso_header_id = payload.ISO_HEADER_ID;
    }
    return criteria;
  }

  private normalizeStatus(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }
    return String(value).trim().toUpperCase();
  }

  private hasAllDeliverySuccess(row: Record<string, unknown>): boolean {
    const statuses = [
      row.CREATE_DELIVERY_STATUS ?? row.create_delivery_status,
      row.UPDATE_DELIVERY_STATUS ?? row.update_delivery_status,
      row.PICK_RELEASE_STATUS ?? row.pick_release_status,
      row.SHIP_CONFIRM_STATUS ?? row.ship_confirm_status,
    ];

    return statuses.every(
      (status) => this.normalizeStatus(status) === this.successStatus,
    );
  }

  private async validateBeforeCreate(
    criteria: ShipConfirmInternalFindDto,
  ): Promise<{ action: 'CREATE' | 'RETURN_EXISTING' }> {
    const rows = await this.shipConfirmInternalDeliveryService.find(criteria);

    if (rows.length === 0) {
      return { action: 'CREATE' };
    }

    const latestRows = this.keepLatestRows(rows);
    if (
      latestRows.length > 0 &&
      latestRows.every((row) => this.hasAllDeliverySuccess(row))
    ) {
      this.logger.log(
        `Skipping create for ${this.buildFindCriteriaLabel(criteria)}: all delivery statuses are S`,
      );
      return { action: 'RETURN_EXISTING' };
    }

    return { action: 'CREATE' };
  }

  private buildFindCriteriaLabel(criteria: ShipConfirmInternalFindDto): string {
    const parts: string[] = [];
    if (criteria.source_header_id) {
      parts.push(`source_header_id ${criteria.source_header_id}`);
    }
    if (criteria.iso_header_id != null) {
      parts.push(`ISO_HEADER_ID ${criteria.iso_header_id}`);
    }
    return parts.join(' and ');
  }

  private keepLatestRows(rows: Record<string, any>[]): Record<string, any>[] {
    if (rows.length <= 1) {
      return rows;
    }

    const transactionType = rows[0].TRANSACTION_TYPE;

    if (
      transactionType ===
      ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE
    ) {
      return this.latestPerKey(rows, 'SOURCE_LINE_ID');
    }

    if (
      transactionType ===
      ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM
    ) {
      return this.latestPerKey(rows, 'DELIVERY_ID');
    }

    return [rows[0]];
  }

  private latestPerKey(
    rows: Record<string, any>[],
    key: string,
  ): Record<string, any>[] {
    const seen = new Set<string>();
    const latest: Record<string, any>[] = [];

    for (const row of rows) {
      const value = row[key] ?? row[key.toLowerCase()];
      const lineKey = value == null ? '' : String(value);
      if (seen.has(lineKey)) {
        continue;
      }
      seen.add(lineKey);
      latest.push(row);
    }

    return latest;
  }

  private formatRetrievedRows(
    rows: Record<string, any>[],
    notFoundMessage: string,
  ): ShipConfirmInternalResponseDto {
    if (rows.length === 0) {
      return {
        status: false,
        message: notFoundMessage,
        data: null,
      };
    }

    const latestRows = this.keepLatestRows(rows);
    const isMultiLine =
      latestRows[0].TRANSACTION_TYPE ===
        ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE ||
      latestRows[0].TRANSACTION_TYPE ===
        ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM;

    return {
      status: true,
      message: 'Ship confirm internal interface data retrieved successfully',
      data: isMultiLine
        ? {
            SOURCE_HEADER_ID: latestRows[0].SOURCE_HEADER_ID,
            TRANSACTION_TYPE: latestRows[0].TRANSACTION_TYPE,
            LINES: latestRows,
          }
        : latestRows[0],
    };
  }

  private assertPayloadShape(payload: CreateShipConfirmInternalDto): void {
    switch (payload.TRANSACTION_TYPE) {
      case ShipConfirmInternalTransactionType.OUTBOUND_GS_MUTASI_SO_INTERNAL:
        if (payload.ISO_HEADER_ID == null) {
          throw new Error('ISO_HEADER_ID is required for Outbound GS Mutasi SO Internal');
        }
        break;

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE:
        if (!payload.LINES?.length) {
          throw new Error(
            'LINES is required for Outbound GS SO Subdist Pick Release',
          );
        }
        break;

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM:
        if (
          !payload.LINES?.length
        ) {
          throw new Error(
            'DELIVERY_ID, DELIVERY_NAME, and SHIPPED_QUANTITY are required for Outbound GS SO Subdist Ship Confirm',
          );
        }
        break;

      default:
        throw new Error(`Unsupported TRANSACTION_TYPE: ${payload.TRANSACTION_TYPE}`);
    }
  }
}
