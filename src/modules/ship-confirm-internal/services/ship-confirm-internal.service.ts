import { Injectable, Logger } from '@nestjs/common';
import {
  CreateShipConfirmInternalDto,
  CreateShipConfirmPickReleaseLineDto,
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
    const list = this.normalizeCreatePayloads(payloads ?? []);

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
        const validation = await this.validateBeforeCreate(payload);

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

        await this.shipConfirmInternalDeliveryService.create(validation.payload);

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
      transaction_type: payload.TRANSACTION_TYPE,
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

  private getRequiredStatusFields(
    transactionType: ShipConfirmInternalTransactionType,
  ): string[] {
    switch (transactionType) {
      case ShipConfirmInternalTransactionType.OUTBOUND_GS_MUTASI_SO_INTERNAL:
        return [
          'CREATE_DELIVERY_STATUS',
          'UPDATE_DELIVERY_STATUS',
          'PICK_RELEASE_STATUS',
          'SHIP_CONFIRM_STATUS',
        ];

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE:
        return [
          'CREATE_DELIVERY_STATUS',
          'UPDATE_DELIVERY_STATUS',
          'PICK_RELEASE_STATUS',
        ];

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM:
        return ['SHIP_CONFIRM_STATUS'];

      default:
        return [];
    }
  }

  private getRowStatus(
    row: Record<string, unknown>,
    field: string,
  ): unknown {
    return row[field] ?? row[field.toLowerCase()];
  }

  private hasRequiredSuccess(
    row: Record<string, unknown>,
    fields: string[],
  ): boolean {
    return fields.every(
      (field) =>
        this.normalizeStatus(this.getRowStatus(row, field)) ===
        this.successStatus,
    );
  }

  private async validateBeforeCreate(
    payload: CreateShipConfirmInternalDto,
  ): Promise<{
    action: 'CREATE' | 'RETURN_EXISTING';
    payload: CreateShipConfirmInternalDto;
  }> {
    const criteria = this.buildFindCriteriaFromPayload(payload);
    const rows = await this.shipConfirmInternalDeliveryService.find(criteria);
    const requiredFields = this.getRequiredStatusFields(payload.TRANSACTION_TYPE);

    if (rows.length === 0 || requiredFields.length === 0) {
      return { action: 'CREATE', payload };
    }

    const latestRows = this.keepLatestRows(rows);

    switch (payload.TRANSACTION_TYPE) {
      case ShipConfirmInternalTransactionType.OUTBOUND_GS_MUTASI_SO_INTERNAL:
        if (
          latestRows.length > 0 &&
          this.hasRequiredSuccess(latestRows[0], requiredFields)
        ) {
          this.logger.log(
            `Skipping create for ${this.buildFindCriteriaLabel(criteria)}: ${requiredFields.join(', ')} are S`,
          );
          return { action: 'RETURN_EXISTING', payload };
        }
        return { action: 'CREATE', payload };

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE:
        return this.validateMultiLineBeforeCreate(
          payload,
          latestRows,
          requiredFields,
          'SOURCE_LINE_ID',
          criteria,
        );

      case ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM:
        return this.validateMultiLineBeforeCreate(
          payload,
          latestRows,
          requiredFields,
          'DELIVERY_ID',
          criteria,
        );

      default:
        return { action: 'CREATE', payload };
    }
  }

  private validateMultiLineBeforeCreate(
    payload: CreateShipConfirmInternalDto,
    latestRows: Record<string, any>[],
    requiredFields: string[],
    lineKey: 'SOURCE_LINE_ID' | 'DELIVERY_ID',
    criteria: ShipConfirmInternalFindDto,
  ): {
    action: 'CREATE' | 'RETURN_EXISTING';
    payload: CreateShipConfirmInternalDto;
  } {
    const linesToCreate = (payload.LINES || []).filter((line) => {
      const lineValue = line[lineKey];
      const existing = latestRows.find(
        (row) =>
          String(this.getRowStatus(row, lineKey) ?? '') === String(lineValue),
      );

      if (!existing) {
        return true;
      }

      return !this.hasRequiredSuccess(existing, requiredFields);
    });

    if (linesToCreate.length === 0) {
      this.logger.log(
        `Skipping create for ${this.buildFindCriteriaLabel(criteria)}: existing lines already have ${requiredFields.join(', ')} = S`,
      );
      return { action: 'RETURN_EXISTING', payload };
    }

    if (linesToCreate.length < (payload.LINES?.length || 0)) {
      this.logger.log(
        `Creating ${linesToCreate.length} of ${payload.LINES?.length || 0} lines for ${this.buildFindCriteriaLabel(criteria)}; others already have success status`,
      );
    }

    return {
      action: 'CREATE',
      payload: {
        ...payload,
        LINES: linesToCreate,
      },
    };
  }

  private buildFindCriteriaLabel(criteria: ShipConfirmInternalFindDto): string {
    const parts: string[] = [];
    if (criteria.source_header_id) {
      parts.push(`source_header_id ${criteria.source_header_id}`);
    }
    if (criteria.iso_header_id != null) {
      parts.push(`ISO_HEADER_ID ${criteria.iso_header_id}`);
    }
    if (criteria.transaction_type) {
      parts.push(`TRANSACTION_TYPE ${criteria.transaction_type}`);
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

  private normalizeCreatePayloads(
    payloads: CreateShipConfirmInternalDto[],
  ): CreateShipConfirmInternalDto[] {
    const normalized = payloads.map((payload) =>
      this.normalizeSinglePayload(payload),
    );
    return this.groupShipConfirmPayloads(normalized);
  }

  private normalizeSinglePayload(
    payload: CreateShipConfirmInternalDto,
  ): CreateShipConfirmInternalDto {
    if (
      payload.TRANSACTION_TYPE !==
      ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM
    ) {
      return payload;
    }

    if (payload.LINES?.length) {
      return payload;
    }

    if (
      payload.DELIVERY_ID == null ||
      !payload.DELIVERY_NAME ||
      payload.SHIPPED_QUANTITY == null
    ) {
      return payload;
    }

    return {
      ...payload,
      LINES: [
        {
          DELIVERY_ID: payload.DELIVERY_ID,
          DELIVERY_NAME: payload.DELIVERY_NAME,
          SHIPPED_QUANTITY: payload.SHIPPED_QUANTITY,
        } as CreateShipConfirmPickReleaseLineDto,
      ],
    };
  }

  private groupShipConfirmPayloads(
    payloads: CreateShipConfirmInternalDto[],
  ): CreateShipConfirmInternalDto[] {
    const otherPayloads: CreateShipConfirmInternalDto[] = [];
    const grouped = new Map<string, CreateShipConfirmInternalDto>();

    for (const payload of payloads) {
      if (
        payload.TRANSACTION_TYPE !==
        ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM
      ) {
        otherPayloads.push(payload);
        continue;
      }

      const key = `${payload.TRANSACTION_TYPE}|${payload.SOURCE_SYSTEM}|${payload.SOURCE_HEADER_ID}`;
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          ...payload,
          LINES: [...(payload.LINES || [])],
        });
        continue;
      }

      existing.LINES = [...(existing.LINES || []), ...(payload.LINES || [])];
    }

    return [...otherPayloads, ...grouped.values()];
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
        if (!payload.LINES?.length) {
          throw new Error(
            'DELIVERY_ID, DELIVERY_NAME, and SHIPPED_QUANTITY are required for Outbound GS SO Subdist Ship Confirm',
          );
        }

        for (const line of payload.LINES) {
          if (
            line.DELIVERY_ID == null ||
            !line.DELIVERY_NAME ||
            line.SHIPPED_QUANTITY == null
          ) {
            throw new Error(
              'Each ship confirm line requires DELIVERY_ID, DELIVERY_NAME, and SHIPPED_QUANTITY',
            );
          }
        }
        break;

      default:
        throw new Error(`Unsupported TRANSACTION_TYPE: ${payload.TRANSACTION_TYPE}`);
    }
  }
}
