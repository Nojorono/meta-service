import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { ArTermsDto, ArTermsQueryDto } from '../dtos/ar-terms.dtos';

@Injectable()
export class ArTermsService {
  private readonly logger = new Logger(ArTermsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllArTerms(
    queryDto: ArTermsQueryDto = {},
  ): Promise<ArTermsDto[]> {
    try {
      const { 
        TERM_ID, 
        NAME, 
        TYPE, 
        ENABLED_FLAG, 
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          TERM_ID,
          NAME,
          DESCRIPTION,
          TYPE,
          DUE_DAYS,
          DUE_DAY_OF_MONTH,
          DUE_MONTHS_FORWARD,
          DISCOUNT_DAYS,
          DISCOUNT_DAY_OF_MONTH,
          DISCOUNT_MONTHS_FORWARD,
          DISCOUNT_PERCENT,
          ENABLED_FLAG,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
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
          ATTRIBUTE_CATEGORY,
          CREATED_BY,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          LAST_UPDATED_BY,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          LAST_UPDATE_LOGIN
        FROM APPS.XTD_AR_TERMS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TERM_ID) {
        query += ` AND TERM_ID = :${paramIndex}`;
        params.push(TERM_ID);
        paramIndex++;
      }

      if (NAME) {
        query += ` AND UPPER(NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${NAME}%`);
        paramIndex++;
      }

      if (TYPE) {
        query += ` AND UPPER(TYPE) = UPPER(:${paramIndex})`;
        params.push(TYPE);
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
      
      this.logger.log(`Found ${result.rows.length} AR terms`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching AR terms:', error);
      throw error;
    }
  }

  async findArTermById(id: number): Promise<ArTermsDto> {
    try {
      const query = `
        SELECT 
          TERM_ID,
          NAME,
          DESCRIPTION,
          TYPE,
          DUE_DAYS,
          DUE_DAY_OF_MONTH,
          DUE_MONTHS_FORWARD,
          DISCOUNT_DAYS,
          DISCOUNT_DAY_OF_MONTH,
          DISCOUNT_MONTHS_FORWARD,
          DISCOUNT_PERCENT,
          ENABLED_FLAG,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
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
          ATTRIBUTE_CATEGORY,
          CREATED_BY,
          TO_CHAR(CREATION_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS CREATION_DATE,
          LAST_UPDATED_BY,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          LAST_UPDATE_LOGIN
        FROM APPS.XTD_AR_TERMS_V
        WHERE TERM_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      
      if (!result.rows.length) {
        throw new Error(`AR term with ID ${id} not found`);
      }
      
      this.logger.log(`Found AR term with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching AR term with ID ${id}:`, error);
      throw error;
    }
  }

  async countArTerms(queryDto: ArTermsQueryDto = {}): Promise<number> {
    try {
      const { 
        TERM_ID, 
        NAME, 
        TYPE, 
        ENABLED_FLAG 
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AR_TERMS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TERM_ID) {
        query += ` AND TERM_ID = :${paramIndex}`;
        params.push(TERM_ID);
        paramIndex++;
      }

      if (NAME) {
        query += ` AND UPPER(NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${NAME}%`);
        paramIndex++;
      }

      if (TYPE) {
        query += ` AND UPPER(TYPE) = UPPER(:${paramIndex})`;
        params.push(TYPE);
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
      this.logger.error('Error counting AR terms:', error);
      throw error;
    }
  }
}
