import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { FpprSalesTypesDto, FpprSalesTypesQueryDto } from '../dtos/fppr-sales-types.dtos';

@Injectable()
export class FpprSalesTypesService {
  private readonly logger = new Logger(FpprSalesTypesService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllFpprSalesTypes(
    queryDto: FpprSalesTypesQueryDto = {},
  ): Promise<FpprSalesTypesDto[]> {
    try {
      const { 
        FPPR_SALES_TYPE_CODE,
        DESCRIPTION,
        ENABLED_FLAG,
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          FPPR_SALES_TYPE_CODE,
          DESCRIPTION,
          ENABLED_FLAG,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          LAST_UPDATE_DATE 
        FROM APPS.XTD_ONT_FPPR_SALES_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (FPPR_SALES_TYPE_CODE) {
        query += ` AND UPPER(FPPR_SALES_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(FPPR_SALES_TYPE_CODE);
        paramIndex++;
      }

      if (DESCRIPTION) {
        query += ` AND UPPER(DESCRIPTION) = UPPER(:${paramIndex})`;
        params.push(DESCRIPTION);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY FPPR_SALES_TYPE_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} FPPR sales types`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching FPPR sales types:', error);
      throw error;
    }
  }

  async findFpprSalesTypeByCode(lookupCode: string): Promise<FpprSalesTypesDto> {
    try {
      const query = `
        SELECT 
          FPPR_SALES_TYPE_CODE,
          DESCRIPTION,
          ENABLED_FLAG,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          LAST_UPDATE_DATE 
        FROM APPS.XTD_ONT_FPPR_SALES_TYPES_V
        WHERE LOOKUP_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [lookupCode]);
      
      if (!result.rows.length) {
        throw new Error(`FPPR sales type with code ${lookupCode} not found`);
      }
      
      this.logger.log(`Found FPPR sales type with code: ${lookupCode}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching FPPR sales type with code ${lookupCode}:`, error);
      throw error;
    }
  }

  async countFpprSalesTypes(queryDto: FpprSalesTypesQueryDto = {}): Promise<number> {
    try {
      const { 
        FPPR_SALES_TYPE_CODE,
        DESCRIPTION,
        ENABLED_FLAG
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_ONT_FPPR_SALES_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (FPPR_SALES_TYPE_CODE) {
        query += ` AND UPPER(FPPR_SALES_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(FPPR_SALES_TYPE_CODE);
        paramIndex++;
      }

      if (DESCRIPTION) {
        query += ` AND UPPER(DESCRIPTION) = UPPER(:${paramIndex})`;
        params.push(DESCRIPTION);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      
      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting FPPR sales types:', error);
      throw error;
    }
  }
}
