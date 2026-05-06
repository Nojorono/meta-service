import { Injectable, Logger } from '@nestjs/common';
import {
  CreateRcvReceiptDto,
  RcvReceiptResponseDto,
} from '../dtos/rcv-receipt.dtos';
import { RcvReceiptHeaderService } from './rcv-receipt-header.service';
import { RcvReceiptLinesService } from './rcv-receipt-lines.service';

@Injectable()
export class RcvReceiptService {
  private readonly logger = new Logger(RcvReceiptService.name);

  constructor(
    private readonly rcvReceiptHeaderService: RcvReceiptHeaderService,
    private readonly rcvReceiptLinesService: RcvReceiptLinesService,
  ) { }

  async create(
    payloads: CreateRcvReceiptDto[],
  ): Promise<RcvReceiptResponseDto> {
    const list = payloads ?? [];

    if (list.length === 0) {
      return {
        status: true,
        message: 'No receipt data to insert',
        data: [],
      };
    }

    try {
      const data: RcvReceiptResponseDto['data'][] = [];

      for (const payload of list) {
        await this.rcvReceiptLinesService.createMany(
          payload.LINES || [],
          payload.SOURCE_HEADER_ID,
        );
        await this.rcvReceiptHeaderService.create(payload);

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
        message: 'Receipt header and line interface data inserted successfully',
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error inserting receipt interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error inserting receipt interface data: ${error.message}`,
        data: null,
      };
    }
  }

  async getBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<RcvReceiptResponseDto> {
    try {
      const header =
        await this.rcvReceiptHeaderService.findLatestBySourceHeaderId(
          sourceHeaderId,
        );

      if (!header) {
        return {
          status: false,
          message: `No receipt data found for source_header_id ${sourceHeaderId}`,
          data: null,
        };
      }

      const lines =
        await this.rcvReceiptLinesService.findByIfaceHeaderId(header.IFACE_HEADER_ID);

      return {
        status: true,
        message: 'Receipt header and line interface data retrieved successfully',
        data: {
          ...header,
          LINES: lines,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving receipt interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error retrieving receipt interface data: ${error.message}`,
        data: null,
      };
    }
  }
}
