import { Injectable, Logger } from '@nestjs/common';
import {
  CreateShipConfirmInternalDto,
  ShipConfirmInternalResponseDto,
  ShipConfirmInternalTransactionType,
} from '../dtos/ship-confirm-internal.dtos';
import { ShipConfirmInternalDeliveryService } from './ship-confirm-internal-delivery.service';

@Injectable()
export class ShipConfirmInternalService {
  private readonly logger = new Logger(ShipConfirmInternalService.name);

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

        await this.shipConfirmInternalDeliveryService.create(payload);

        const fetched = await this.getBySourceHeaderId(payload.SOURCE_HEADER_ID);
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

  async getBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<ShipConfirmInternalResponseDto> {
    try {
      const rows =
        await this.shipConfirmInternalDeliveryService.findBySourceHeaderId(
          sourceHeaderId,
        );

      if (rows.length === 0) {
        return {
          status: false,
          message: `No ship confirm internal data found for source_header_id ${sourceHeaderId}`,
          data: null,
        };
      }

      const isPickRelease =
        rows[0].TRANSACTION_TYPE ===
        ShipConfirmInternalTransactionType.OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE;

      return {
        status: true,
        message: 'Ship confirm internal interface data retrieved successfully',
        data: isPickRelease
          ? {
              SOURCE_HEADER_ID: sourceHeaderId,
              TRANSACTION_TYPE: rows[0].TRANSACTION_TYPE,
              LINES: rows,
            }
          : rows[0],
      };
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
          payload.DELIVERY_ID == null ||
          !payload.DELIVERY_NAME ||
          payload.SHIPPED_QUANTITY == null
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
