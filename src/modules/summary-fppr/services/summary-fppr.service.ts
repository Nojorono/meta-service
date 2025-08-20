import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { SummaryFpprDto, SummaryFpprQueryDto } from '../dtos/summary-fppr.dtos';

@Injectable()
export class SummaryFpprService {
  private readonly logger = new Logger(SummaryFpprService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllSummaryFpprs(
    queryDto: SummaryFpprQueryDto = {},
  ): Promise<SummaryFpprDto[]> {
    try {
      const {
        SUMMARY_ID,
        FPPR_ID,
        FPPR_NUMBER,
        DESCRIPTION,
        SOURCE_SYSTEM,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          *
        FROM APPS.XTD_ONT_SUMMARY_FPPR_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (SUMMARY_ID) {
        query += ` AND SUMMARY_ID = :${paramIndex}`;
        params.push(SUMMARY_ID);
        paramIndex++;
      }

      if (FPPR_ID) {
        query += ` AND FPPR_ID = :${paramIndex}`;
        params.push(FPPR_ID);
        paramIndex++;
      }

      if (FPPR_NUMBER) {
        query += ` AND UPPER(FPPR_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${FPPR_NUMBER}%`);
        paramIndex++;
      }

      if (DESCRIPTION) {
        query += ` AND UPPER(DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${DESCRIPTION}%`);
        paramIndex++;
      }

      if (SOURCE_SYSTEM) {
        query += ` AND UPPER(SOURCE_SYSTEM) = UPPER(:${paramIndex})`;
        params.push(SOURCE_SYSTEM);
        paramIndex++;
      }

      const offset = (page - 1) * limit;
      query += ` ORDER BY SUMMARY_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
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
          *
        FROM APPS.XTD_ONT_SUMMARY_FPPR_V
        WHERE SUMMARY_ID = :1
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

  async countSummaryFpprs(queryDto: SummaryFpprQueryDto = {}): Promise<number> {
    try {
      const { SUMMARY_ID, FPPR_ID, FPPR_NUMBER, DESCRIPTION, SOURCE_SYSTEM } =
        queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_ONT_SUMMARY_FPPR_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (SUMMARY_ID) {
        query += ` AND SUMMARY_ID = :${paramIndex}`;
        params.push(SUMMARY_ID);
        paramIndex++;
      }

      if (FPPR_ID) {
        query += ` AND FPPR_ID = :${paramIndex}`;
        params.push(FPPR_ID);
        paramIndex++;
      }

      if (FPPR_NUMBER) {
        query += ` AND UPPER(FPPR_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${FPPR_NUMBER}%`);
        paramIndex++;
      }

      if (DESCRIPTION) {
        query += ` AND UPPER(DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${DESCRIPTION}%`);
        paramIndex++;
      }

      if (SOURCE_SYSTEM) {
        query += ` AND UPPER(SOURCE_SYSTEM) = UPPER(:${paramIndex})`;
        params.push(SOURCE_SYSTEM);
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
