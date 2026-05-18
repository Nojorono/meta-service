import { Injectable, Logger } from '@nestjs/common';
import {
  CreatePoInternalReqDto,
  PoInternalReqResponseDto,
} from '../dtos/po-internal-req.dtos';
import { PoInternalReqHeaderService } from './po-internal-req-header.service';
import { PoInternalReqLinesService } from './po-internal-req-lines.service';

@Injectable()
export class PoInternalReqService {
  private readonly logger = new Logger(PoInternalReqService.name);
  private readonly successStatus = 'S';

  constructor(
    private readonly poInternalReqHeaderService: PoInternalReqHeaderService,
    private readonly poInternalReqLinesService: PoInternalReqLinesService,
  ) { }

  async create(
    payloads: CreatePoInternalReqDto[],
  ): Promise<PoInternalReqResponseDto> {
    const list = payloads ?? [];

    if (list.length === 0) {
      return {
        status: true,
        message: 'No PO internal requisition data to insert',
        data: [],
      };
    }

    try {
      const data: PoInternalReqResponseDto['data'][] = [];

      for (const payload of list) {
        const validation = await this.validateBeforeCreate(
          payload.SOURCE_HEADER_ID,
        );

        if (validation.action === 'RETURN_EXISTING') {
          const existing = await this.getBySourceHeaderId(
            payload.SOURCE_HEADER_ID,
          );
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

        await this.poInternalReqLinesService.createMany(
          payload.LINES || [],
          payload.SOURCE_HEADER_ID,
        );
        await this.poInternalReqHeaderService.create(payload);

        const fetched = await this.getBySourceHeaderId(
          payload.SOURCE_HEADER_ID,
        );
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
        message: 'PO internal requisition interface data inserted successfully',
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error inserting PO internal requisition interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error inserting PO internal requisition interface data: ${error.message}`,
        data: null,
      };
    }
  }

  async getBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<PoInternalReqResponseDto> {
    try {
      const header =
        await this.poInternalReqHeaderService.findLatestBySourceHeaderId(
          sourceHeaderId,
        );

      if (!header) {
        return {
          status: false,
          message: `No PO internal requisition data found for source_header_id ${sourceHeaderId}`,
          data: null,
        };
      }

      const lines =
        await this.poInternalReqLinesService.findByIfaceHeaderId(header.IFACE_HEADER_ID);

      return {
        status: true,
        message: 'PO internal requisition header and line interface data retrieved successfully',
        data: {
          ...header,
          LINES: lines,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving PO internal requisition interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error retrieving PO internal requisition interface data: ${error.message}`,
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

  private hasIfaceSuccess(header: Record<string, unknown>): boolean {
    const statuses = [
      header.IFACE_STATUS_IR,
      header.IFACE_STATUS_IO,
      header.IFACE_STATUS_OI,
    ];
    return statuses.some(
      (status) => this.normalizeStatus(status) === this.successStatus,
    );
  }

  private async validateBeforeCreate(
    sourceHeaderId: string,
  ): Promise<{
    action: 'CREATE' | 'RETURN_EXISTING';
    response: PoInternalReqResponseDto;
  }> {
    const existingHeader =
      await this.poInternalReqHeaderService.findLatestBySourceHeaderId(
        sourceHeaderId,
      );

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

    if (this.hasIfaceSuccess(existingHeader)) {
      return {
        action: 'RETURN_EXISTING',
        response: {
          status: true,
          message:
            `Cannot create PO internal requisition for source_header_id ${sourceHeaderId}. ` +
            'Existing interface data already has success status (IFACE_STATUS_IR, IFACE_STATUS_IO, or IFACE_STATUS_OI = S).',
          data: {
            SOURCE_HEADER_ID: sourceHeaderId,
            IFACE_STATUS_IR: existingHeader.IFACE_STATUS_IR ?? null,
            IFACE_STATUS_IO: existingHeader.IFACE_STATUS_IO ?? null,
            IFACE_STATUS_OI: existingHeader.IFACE_STATUS_OI ?? null,
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
