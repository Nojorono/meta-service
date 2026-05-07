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
  private readonly inProgressStatuses = new Set(['I']);
  private readonly successStatuses = new Set(['S']);
  private readonly errorStatuses = new Set(['E']);

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
        const validation = await this.validateBeforeCreate(payload.SOURCE_HEADER_ID);
        if (validation.action === 'REJECT') {
          return validation.response;
        }

        await this.rcvReceiptLinesService.createMany(
          payload.LINES || [],
          payload.SOURCE_HEADER_ID,
        );
        await this.rcvReceiptHeaderService.create(payload);

        data.push({
          SOURCE_HEADER_ID: payload.SOURCE_HEADER_ID,
          TOTAL_LINES: payload.TOTAL_LINES,
          INSERTED_LINES: payload.LINES?.length || 0,
        });
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

  private normalizeStatus(value: unknown): string {
    if (typeof value !== 'string') {
      return '';
    }
    return value.trim().toUpperCase();
  }

  private async validateBeforeCreate(
    sourceHeaderId: string,
  ): Promise<{
    action: 'CREATE' | 'RETURN_EXISTING' | 'REJECT';
    response: RcvReceiptResponseDto;
  }> {
    const existingHeader =
      await this.rcvReceiptHeaderService.findLatestBySourceHeaderId(sourceHeaderId);

    if (!existingHeader) {
      return {
        action: 'CREATE',
        response: {
          status: true,
          message: 'Validation passed',
          data: null,
        },
      };
    }

    const headerStatus = this.normalizeStatus(existingHeader.STATUS);
    const headerStatusSelisih = this.normalizeStatus(existingHeader.STATUS_SELISIH);
    const headerInProgress =
      this.inProgressStatuses.has(headerStatus) ||
      this.inProgressStatuses.has(headerStatusSelisih);
    const headerSuccess =
      this.successStatuses.has(headerStatus) ||
      this.successStatuses.has(headerStatusSelisih);
    const headerError =
      this.errorStatuses.has(headerStatus) ||
      this.errorStatuses.has(headerStatusSelisih);

    const existingLines = await this.rcvReceiptLinesService.findByIfaceHeaderId(
      existingHeader.IFACE_HEADER_ID,
    );

    const inProgressLine = existingLines.find((line) => {
      const lineStatus = this.normalizeStatus(line.STATUS);
      const lineStatusSelisih = this.normalizeStatus(line.STATUS_SELISIH);
      return (
        this.inProgressStatuses.has(lineStatus) ||
        this.inProgressStatuses.has(lineStatusSelisih)
      );
    });

    const successLine = existingLines.find((line) => {
      const lineStatus = this.normalizeStatus(line.STATUS);
      const lineStatusSelisih = this.normalizeStatus(line.STATUS_SELISIH);
      return (
        this.successStatuses.has(lineStatus) ||
        this.successStatuses.has(lineStatusSelisih)
      );
    });

    const errorLine = existingLines.find((line) => {
      const lineStatus = this.normalizeStatus(line.STATUS);
      const lineStatusSelisih = this.normalizeStatus(line.STATUS_SELISIH);
      return (
        this.errorStatuses.has(lineStatus) ||
        this.errorStatuses.has(lineStatusSelisih)
      );
    });

    if (headerInProgress || inProgressLine) {
      return {
        action: 'REJECT',
        response: {
          status: false,
          message:
            `Cannot create receipt for source_header_id ${sourceHeaderId}. ` +
            'Existing interface data is still in progress.',
          data: {
            SOURCE_HEADER_ID: sourceHeaderId,
            HEADER_STATUS: existingHeader.STATUS ?? null,
            HEADER_MESSAGE: existingHeader.MESSAGE ?? null,
            HEADER_STATUS_SELISIH: existingHeader.STATUS_SELISIH ?? null,
            HEADER_MESSAGE_SELISIH: existingHeader.MESSAGE_SELISIH ?? null,
            LINE_STATUS: inProgressLine?.STATUS ?? null,
            LINE_MESSAGE: inProgressLine?.MESSAGE ?? null,
            LINE_STATUS_SELISIH: inProgressLine?.STATUS_SELISIH ?? null,
            LINE_MESSAGE_SELISIH: inProgressLine?.MESSAGE_SELISIH ?? null,
          },
        },
      };
    }

    if (headerSuccess || headerError || successLine || errorLine) {
      return {
        action: 'RETURN_EXISTING',
        response: {
          status: true,
          message: 'Existing receipt status found. Returning current interface data.',
          data: {
            SOURCE_HEADER_ID: sourceHeaderId,
          },
        },
      };
    }

    return {
      action: 'CREATE',
      response: {
        status: true,
        message: 'Validation passed',
        data: null,
      },
    };
  }
}
