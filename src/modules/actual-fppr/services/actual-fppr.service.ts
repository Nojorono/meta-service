import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  CreateActualFpprDto,
  ActualFpprResponseDto,
} from '../dtos/actual-fppr.dtos';

@Injectable()
export class ActualFpprService {
  private readonly logger = new Logger(ActualFpprService.name);

  constructor(private readonly oracleService: OracleService) {}

  async createActualFppr(
    createDto: CreateActualFpprDto,
  ): Promise<ActualFpprResponseDto> {
    try {
      const insertQuery = `
        INSERT INTO XTD_ONT_ACTUAL_FPPR_IFACE_V (
          FPPR_NUMBER,
          ACTUAL_DATE,
          ACTUAL_STATUS,
          ORGANIZATION_ID,
          ORG_ID,
          DESCRIPTION,
          ATTRIBUTE_CATEGORY,
          ATTRIBUTE1,
          ATTRIBUTE2,
          ATTRIBUTE3,
          ATTRIBUTE4,
          ATTRIBUTE5,
          ATTRIBUTE6,
          ATTRIBUTE7,
          ATTRIBUTE8,
          ATTRIBUTE9,
          ATTRIBUTE10,
          ATTRIBUTE11,
          ATTRIBUTE12,
          ATTRIBUTE13,
          ATTRIBUTE14,
          ATTRIBUTE15,
          REQUEST_ID,
          SOURCE_SYSTEM,
          SOURCE_BATCH_ID,
          SOURCE_HEADER_ID,
          SOURCE_LINE_ID,
          LAST_UPDATE_LOGIN,
          CREATION_DATE,
          CREATED_BY,
          LAST_UPDATE_DATE,
          LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, SYSDATE, :29, SYSDATE, :29
        )
      `;

      const insertParams = [
        createDto.FPPR_NUMBER,
        new Date(createDto.ACTUAL_DATE),
        createDto.ACTUAL_STATUS,
        createDto.ORGANIZATION_ID || null,
        createDto.ORG_ID || null,
        createDto.DESCRIPTION || null,
        createDto.ATTRIBUTE_CATEGORY || null,
        createDto.ATTRIBUTE1 || null,
        createDto.ATTRIBUTE2 || null,
        createDto.ATTRIBUTE3 || null,
        createDto.ATTRIBUTE4 || null,
        createDto.ATTRIBUTE5 || null,
        createDto.ATTRIBUTE6 || null,
        createDto.ATTRIBUTE7 || null,
        createDto.ATTRIBUTE8 || null,
        createDto.ATTRIBUTE9 || null,
        createDto.ATTRIBUTE10 || null,
        createDto.ATTRIBUTE11 || null,
        createDto.ATTRIBUTE12 || null,
        createDto.ATTRIBUTE13 || null,
        createDto.ATTRIBUTE14 || null,
        createDto.ATTRIBUTE15 || null,
        createDto.REQUEST_ID || null,
        createDto.SOURCE_SYSTEM,
        createDto.SOURCE_BATCH_ID,
        createDto.SOURCE_HEADER_ID,
        createDto.SOURCE_LINE_ID,
        createDto.LAST_UPDATE_LOGIN || null,
        1,
      ];

      await this.oracleService.executeQuery(insertQuery, insertParams);

      const selectQuery = `
        SELECT
          ACTUAL_ID,
          FPPR_NUMBER,
          ACTUAL_DATE,
          ACTUAL_STATUS,
          ORGANIZATION_ID,
          ORG_ID,
          DESCRIPTION,
          ATTRIBUTE_CATEGORY,
          ATTRIBUTE1,
          ATTRIBUTE2,
          ATTRIBUTE3,
          ATTRIBUTE4,
          ATTRIBUTE5,
          ATTRIBUTE6,
          ATTRIBUTE7,
          ATTRIBUTE8,
          ATTRIBUTE9,
          ATTRIBUTE10,
          ATTRIBUTE11,
          ATTRIBUTE12,
          ATTRIBUTE13,
          ATTRIBUTE14,
          ATTRIBUTE15,
          REQUEST_ID,
          SOURCE_SYSTEM,
          SOURCE_BATCH_ID,
          SOURCE_HEADER_ID,
          SOURCE_LINE_ID,
          LAST_UPDATE_LOGIN,
          CREATION_DATE,
          CREATED_BY,
          LAST_UPDATE_DATE,
          LAST_UPDATED_BY
        FROM XTD_ONT_ACTUAL_FPPR_IFACE_V
        WHERE FPPR_NUMBER = :1
        AND SOURCE_BATCH_ID = :2
        AND SOURCE_HEADER_ID = :3
        AND SOURCE_LINE_ID = :4
        ORDER BY ACTUAL_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

      const selectParams = [
        createDto.FPPR_NUMBER,
        createDto.SOURCE_BATCH_ID,
        createDto.SOURCE_HEADER_ID,
        createDto.SOURCE_LINE_ID,
      ];

      const result = await this.oracleService.executeQuery(
        selectQuery,
        selectParams,
      );

      if (result.rows.length === 0) {
        throw new Error('Failed to retrieve created actual FPPR');
      }

      const createdRecord = result.rows[0];
      this.logger.log(
        `Created actual FPPR with ID: ${createdRecord.ACTUAL_ID}`,
      );

      const response: ActualFpprResponseDto = {
        ACTUAL_ID: createdRecord.ACTUAL_ID,
        FPPR_NUMBER: createdRecord.FPPR_NUMBER,
        ACTUAL_DATE: createdRecord.ACTUAL_DATE,
        ACTUAL_STATUS: createdRecord.ACTUAL_STATUS,
        ORGANIZATION_ID: createdRecord.ORGANIZATION_ID,
        ORG_ID: createdRecord.ORG_ID,
        DESCRIPTION: createdRecord.DESCRIPTION,
        ATTRIBUTE_CATEGORY: createdRecord.ATTRIBUTE_CATEGORY,
        ATTRIBUTE1: createdRecord.ATTRIBUTE1,
        ATTRIBUTE2: createdRecord.ATTRIBUTE2,
        ATTRIBUTE3: createdRecord.ATTRIBUTE3,
        ATTRIBUTE4: createdRecord.ATTRIBUTE4,
        ATTRIBUTE5: createdRecord.ATTRIBUTE5,
        ATTRIBUTE6: createdRecord.ATTRIBUTE6,
        ATTRIBUTE7: createdRecord.ATTRIBUTE7,
        ATTRIBUTE8: createdRecord.ATTRIBUTE8,
        ATTRIBUTE9: createdRecord.ATTRIBUTE9,
        ATTRIBUTE10: createdRecord.ATTRIBUTE10,
        ATTRIBUTE11: createdRecord.ATTRIBUTE11,
        ATTRIBUTE12: createdRecord.ATTRIBUTE12,
        ATTRIBUTE13: createdRecord.ATTRIBUTE13,
        ATTRIBUTE14: createdRecord.ATTRIBUTE14,
        ATTRIBUTE15: createdRecord.ATTRIBUTE15,
        REQUEST_ID: createdRecord.REQUEST_ID,
        SOURCE_SYSTEM: createdRecord.SOURCE_SYSTEM,
        SOURCE_BATCH_ID: createdRecord.SOURCE_BATCH_ID,
        SOURCE_HEADER_ID: createdRecord.SOURCE_HEADER_ID,
        SOURCE_LINE_ID: createdRecord.SOURCE_LINE_ID,
        LAST_UPDATE_LOGIN: createdRecord.LAST_UPDATE_LOGIN,
        CREATION_DATE: createdRecord.CREATION_DATE,
        CREATED_BY: createdRecord.CREATED_BY,
        LAST_UPDATE_DATE: createdRecord.LAST_UPDATE_DATE,
        LAST_UPDATED_BY: createdRecord.LAST_UPDATED_BY,
      };

      return response;
    } catch (error) {
      this.logger.error('Error creating actual FPPR:', error);
      throw error;
    }
  }
}
