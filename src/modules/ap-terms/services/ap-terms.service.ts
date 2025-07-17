import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { ApTermsDto, ApTermsQueryDto } from '../dtos/ap-terms.dtos';

@Injectable()
export class ApTermsService {
  private readonly logger = new Logger(ApTermsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllApTerms(
    queryDto: ApTermsQueryDto = {},
  ): Promise<ApTermsDto[]> {
    try {
      const { 
        TERM_ID,  
        TERM_NAME, 
        DESCRIPTION, 
        ENABLED_FLAG, 
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          TERM_ID, 
          TERM_NAME, 
          DESCRIPTION, 
          ENABLED_FLAG, 
          START_DATE_ACTIVE, 
          END_DATE_ACTIVE, 
          LAST_UPDATE_DATE, 
          DAY_OF_TERMS 
        FROM APPS.XTD_AP_TERMS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TERM_ID) {
        query += ` AND TERM_ID = :${paramIndex}`;
        params.push(TERM_ID);
        paramIndex++;
      }

      if (TERM_NAME) {
        query += ` AND UPPER(TERM_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(TERM_NAME);
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
      query += ` ORDER BY TERM_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} AP terms`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching AP terms:', error);
      throw error;
    }
  }

  async findApTermById(id: number): Promise<ApTermsDto> {
    try {
      const query = `
        SELECT 
          TERM_ID, 
          TERM_NAME, 
          DESCRIPTION, 
          ENABLED_FLAG, 
          START_DATE_ACTIVE, 
          END_DATE_ACTIVE, 
          LAST_UPDATE_DATE, 
          DAY_OF_TERMS 
        FROM APPS.XTD_AP_TERMS_V
        WHERE TERM_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      
      if (!result.rows.length) {
        throw new Error(`AP term with ID ${id} not found`);
      }
      
      this.logger.log(`Found AP term with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching AP term with ID ${id}:`, error);
      throw error;
    }
  }

  async countApTerms(queryDto: ApTermsQueryDto = {}): Promise<number> {
    try {
      const { 
        TERM_ID, 
        TERM_NAME, 
        DESCRIPTION,
        ENABLED_FLAG 
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AP_TERMS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TERM_ID) {
        query += ` AND TERM_ID = :${paramIndex}`;
        params.push(TERM_ID);
        paramIndex++;
      }

      if (TERM_NAME) {
        query += ` AND UPPER(TERM_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(TERM_NAME);
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
      this.logger.error('Error counting AP terms:', error);
      throw error;
    }
  }
}
