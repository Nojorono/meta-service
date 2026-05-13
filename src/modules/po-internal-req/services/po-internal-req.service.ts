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

      console.log('list', list);

      for (const payload of list) {
        await this.poInternalReqLinesService.createMany(
          payload.LINES || [],
          payload.SOURCE_HEADER_ID,
        );
        await this.poInternalReqHeaderService.create(payload);

        data.push({
          SOURCE_HEADER_ID: payload.SOURCE_HEADER_ID,
          TOTAL_LINES: payload.TOTAL_LINES,
          INSERTED_LINES: payload.LINES?.length || 0,
        });
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
}
