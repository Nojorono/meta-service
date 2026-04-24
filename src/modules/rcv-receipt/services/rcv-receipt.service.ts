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
    payload: CreateRcvReceiptDto,
  ): Promise<RcvReceiptResponseDto> {


    try {
      await this.rcvReceiptHeaderService.create(payload);
      await this.rcvReceiptLinesService.createMany(payload.LINES || []);

      return {
        status: true,
        message: 'Receipt header and line interface data inserted successfully',
        data: {
          SOURCE_HEADER_ID: payload.SOURCE_HEADER_ID,
          TOTAL_LINES: payload.TOTAL_LINES,
          INSERTED_LINES: payload.LINES?.length || 0,
        },
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
