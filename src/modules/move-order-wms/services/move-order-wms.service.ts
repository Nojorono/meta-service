import { Injectable, Logger } from '@nestjs/common';
import {
  CreateMoveOrderWmsDto,
  MoveOrderWmsResponseDto,
} from '../dtos/move-order-wms.dtos';
import { MoveOrderWmsHeaderService } from './move-order-wms-header.service';
import { MoveOrderWmsLinesService } from './move-order-wms-lines.service';

@Injectable()
export class MoveOrderWmsService {
  private readonly logger = new Logger(MoveOrderWmsService.name);
  private readonly ifaceReady = 'READY';
  private readonly ifaceProcess = 'PROCESS';
  private readonly ifaceSuccess = 'SUCCESS';
  private readonly ifaceLegacySuccess = 'S';

  constructor(
    private readonly moveOrderWmsHeaderService: MoveOrderWmsHeaderService,
    private readonly moveOrderWmsLinesService: MoveOrderWmsLinesService,
  ) {}

  async create(payloads: CreateMoveOrderWmsDto[]): Promise<MoveOrderWmsResponseDto> {
    const list = payloads ?? [];

    if (list.length === 0) {
      return {
        status: true,
        message: 'No move order WMS data to insert',
        data: [],
      };
    }

    try {
      const data: MoveOrderWmsResponseDto['data'][] = [];

      for (const payload of list) {
        const validation = await this.validateBeforeCreate(payload.SOURCE_HEADER_ID);

        if (validation.action === 'RETURN_EXISTING') {
          const existing = await this.getBySourceHeaderId(payload.SOURCE_HEADER_ID);
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

        await this.moveOrderWmsLinesService.createMany(
          payload.LINES || [],
          payload.SOURCE_HEADER_ID,
          payload.SOURCE_SYSTEM,
        );
        await this.moveOrderWmsHeaderService.create(payload);

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
        message: 'Move order WMS interface data inserted successfully',
        data,
      };
    } catch (error) {
      this.logger.error(
        `Error inserting move order WMS interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error inserting move order WMS interface data: ${error.message}`,
        data: null,
      };
    }
  }

  async getBySourceHeaderId(
    sourceHeaderId: string,
  ): Promise<MoveOrderWmsResponseDto> {
    try {
      const header =
        await this.moveOrderWmsHeaderService.findLatestBySourceHeaderId(
          sourceHeaderId,
        );

      if (!header) {
        return {
          status: false,
          message: `No move order WMS data found for source_header_id ${sourceHeaderId}`,
          data: null,
        };
      }

      const lines = await this.moveOrderWmsLinesService.findBySourceHeaderId(
        sourceHeaderId,
      );

      return {
        status: true,
        message: 'Move order WMS header and line data retrieved successfully',
        data: {
          ...header,
          LINES: lines,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving move order WMS interface data: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error retrieving move order WMS interface data: ${error.message}`,
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

  private shouldReturnExisting(header: Record<string, unknown>): boolean {
    const status = this.normalizeStatus(header.IFACE_STATUS);
    return [
      this.ifaceReady,
      this.ifaceProcess,
      this.ifaceSuccess,
      this.ifaceLegacySuccess,
    ].includes(status);
  }

  private async validateBeforeCreate(
    sourceHeaderId: string,
  ): Promise<{ action: 'CREATE' | 'RETURN_EXISTING' }> {
    const existingHeader =
      await this.moveOrderWmsHeaderService.findLatestBySourceHeaderId(
        sourceHeaderId,
      );

    if (!existingHeader) {
      return { action: 'CREATE' };
    }

    if (this.shouldReturnExisting(existingHeader)) {
      return { action: 'RETURN_EXISTING' };
    }

    return { action: 'CREATE' };
  }
}
