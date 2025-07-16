import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { FpprTypesDto, FpprTypesQueryDto } from '../dtos/fppr-types.dtos';

@Injectable()
export class FpprTypesService {
  private readonly logger = new Logger(FpprTypesService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllFpprTypes(
    queryDto: FpprTypesQueryDto = {},
  ): Promise<FpprTypesDto[]> {
    try {
      const { 
        LOOKUP_TYPE, 
        LOOKUP_CODE, 
        MEANING, 
        ENABLED_FLAG, 
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          LOOKUP_TYPE,
          LOOKUP_CODE,
          MEANING,
          DESCRIPTION,
          ENABLED_FLAG,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          TERRITORY_CODE,
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
          LAST_UPDATE_LOGIN,
          SOURCE_LANG,
          SECURITY_GROUP_ID,
          VIEW_APPLICATION_ID
        FROM APPS.XTD_ONT_FPPR_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (LOOKUP_TYPE) {
        query += ` AND UPPER(LOOKUP_TYPE) = UPPER(:${paramIndex})`;
        params.push(LOOKUP_TYPE);
        paramIndex++;
      }

      if (LOOKUP_CODE) {
        query += ` AND UPPER(LOOKUP_CODE) = UPPER(:${paramIndex})`;
        params.push(LOOKUP_CODE);
        paramIndex++;
      }

      if (MEANING) {
        query += ` AND UPPER(MEANING) LIKE UPPER(:${paramIndex})`;
        params.push(`%${MEANING}%`);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY LOOKUP_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} FPPR types`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching FPPR types:', error);
      throw error;
    }
  }

  async findFpprTypeByCode(lookupCode: string): Promise<FpprTypesDto> {
    try {
      const query = `
        SELECT 
          LOOKUP_TYPE,
          LOOKUP_CODE,
          MEANING,
          DESCRIPTION,
          ENABLED_FLAG,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          TERRITORY_CODE,
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
          LAST_UPDATE_LOGIN,
          SOURCE_LANG,
          SECURITY_GROUP_ID,
          VIEW_APPLICATION_ID
        FROM APPS.XTD_ONT_FPPR_TYPES_V
        WHERE LOOKUP_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [lookupCode]);
      
      if (!result.rows.length) {
        throw new Error(`FPPR type with code ${lookupCode} not found`);
      }
      
      this.logger.log(`Found FPPR type with code: ${lookupCode}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching FPPR type with code ${lookupCode}:`, error);
      throw error;
    }
  }

  async countFpprTypes(queryDto: FpprTypesQueryDto = {}): Promise<number> {
    try {
      const { 
        LOOKUP_TYPE, 
        LOOKUP_CODE, 
        MEANING, 
        ENABLED_FLAG 
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_ONT_FPPR_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (LOOKUP_TYPE) {
        query += ` AND UPPER(LOOKUP_TYPE) = UPPER(:${paramIndex})`;
        params.push(LOOKUP_TYPE);
        paramIndex++;
      }

      if (LOOKUP_CODE) {
        query += ` AND UPPER(LOOKUP_CODE) = UPPER(:${paramIndex})`;
        params.push(LOOKUP_CODE);
        paramIndex++;
      }

      if (MEANING) {
        query += ` AND UPPER(MEANING) LIKE UPPER(:${paramIndex})`;
        params.push(`%${MEANING}%`);
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
      this.logger.error('Error counting FPPR types:', error);
      throw error;
    }
  }
}
