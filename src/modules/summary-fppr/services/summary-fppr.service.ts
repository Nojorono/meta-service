import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { SummaryFpprDto, SummaryFpprQueryDto } from '../dtos/summary-fppr.dtos';

@Injectable()
export class SummaryFpprService {
  private readonly logger = new Logger(SummaryFpprService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllSummaryFppr(
    queryDto: SummaryFpprQueryDto = {},
  ): Promise<SummaryFpprDto[]> {
    try {
      const {
        HEADER_ID,
        FPPR_NUMBER,
        FPPR_TYPE,
        FPPR_SALES_TYPE,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          HEADER_ID,
          FPPR_NUMBER,
          FPPR_TYPE,
          FPPR_SALES_TYPE,
          SALES_TYPE_NAME,
          TO_CHAR(FPPR_DATE, 'YYYY-MM-DD') AS FPPR_DATE,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          CREATED_BY,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          LAST_UPDATED_BY
        FROM APPS.XTD_ONT_SUMMARY_FPPR_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (HEADER_ID) {
        query += ` AND HEADER_ID = :${paramIndex}`;
        params.push(HEADER_ID);
        paramIndex++;
      }

      if (FPPR_NUMBER) {
        query += ` AND UPPER(FPPR_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${FPPR_NUMBER}%`);
        paramIndex++;
      }

      if (FPPR_TYPE) {
        query += ` AND UPPER(FPPR_TYPE) = UPPER(:${paramIndex})`;
        params.push(FPPR_TYPE);
        paramIndex++;
      }

      if (FPPR_SALES_TYPE) {
        query += ` AND UPPER(FPPR_SALES_TYPE) = UPPER(:${paramIndex})`;
        params.push(FPPR_SALES_TYPE);
        paramIndex++;
      }

      const offset = (page - 1) * limit;
      query += ` ORDER BY HEADER_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} summary FPPR records`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching summary FPPR records:', error);
      throw error;
    }
  }

  async findSummaryFpprById(id: number): Promise<SummaryFpprDto> {
    try {
      const query = `
        SELECT 
          HEADER_ID,
          FPPR_NUMBER,
          FPPR_TYPE,
          FPPR_SALES_TYPE,
          SALES_TYPE_NAME,
          TO_CHAR(FPPR_DATE, 'YYYY-MM-DD') AS FPPR_DATE,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          CREATED_BY,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          LAST_UPDATED_BY
        FROM APPS.XTD_ONT_SUMMARY_FPPR_V
        WHERE HEADER_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      if (!result.rows.length) {
        throw new Error(`Summary FPPR with ID ${id} not found`);
      }

      this.logger.log(`Found summary FPPR with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching summary FPPR with ID ${id}:`, error);
      throw error;
    }
  }

  async countSummaryFppr(queryDto: SummaryFpprQueryDto = {}): Promise<number> {
    try {
      const { HEADER_ID, FPPR_NUMBER, FPPR_TYPE, FPPR_SALES_TYPE } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_ONT_SUMMARY_FPPR_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (HEADER_ID) {
        query += ` AND HEADER_ID = :${paramIndex}`;
        params.push(HEADER_ID);
        paramIndex++;
      }

      if (FPPR_NUMBER) {
        query += ` AND UPPER(FPPR_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${FPPR_NUMBER}%`);
        paramIndex++;
      }

      if (FPPR_TYPE) {
        query += ` AND UPPER(FPPR_TYPE) = UPPER(:${paramIndex})`;
        params.push(FPPR_TYPE);
        paramIndex++;
      }

      if (FPPR_SALES_TYPE) {
        query += ` AND UPPER(FPPR_SALES_TYPE) = UPPER(:${paramIndex})`;
        params.push(FPPR_SALES_TYPE);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting summary FPPR records:', error);
      throw error;
    }
  }
}
