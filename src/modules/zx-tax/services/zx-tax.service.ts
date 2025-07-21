import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { ZxTaxDto, ZxTaxQueryDto } from '../dtos/zx-tax.dtos';

@Injectable()
export class ZxTaxService {
  private readonly logger = new Logger(ZxTaxService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllZxTax(queryDto: ZxTaxQueryDto = {}): Promise<ZxTaxDto[]> {
    try {
      const {
        TAX_ID,
        TAX_NAME,
        TAX_TYPE_CODE,
        TAX_REGIME_CODE,
        ACTIVE_FLAG,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          TAX_ID,
          TAX_NAME,
          TAX_TYPE_CODE,
          TAX_REGIME_CODE,
          TAX_REGIME_NAME,
          TAX_JURISDICTION_CODE,
          TAX_JURISDICTION_NAME,
          TAX_RATE,
          TAX_RATE_ID,
          ENABLED_FLAG,
          TO_CHAR(EFFECTIVE_FROM, 'YYYY-MM-DD') AS EFFECTIVE_FROM,
          TO_CHAR(EFFECTIVE_TO, 'YYYY-MM-DD') AS EFFECTIVE_TO,
          CONTENT_OWNER_ID,
          TAX_CURRENCY_CODE,
          MINIMUM_ACCOUNTABLE_UNIT,
          PRECISION,
          PERCENTAGE_RATE,
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
        FROM APPS.XTD_ZX_TAX_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TAX_ID) {
        query += ` AND TAX_ID = :${paramIndex}`;
        params.push(TAX_ID);
        paramIndex++;
      }

      if (TAX_NAME) {
        query += ` AND UPPER(TAX_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${TAX_NAME}%`);
        paramIndex++;
      }

      if (TAX_TYPE_CODE) {
        query += ` AND UPPER(TAX_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(TAX_TYPE_CODE);
        paramIndex++;
      }

      if (TAX_REGIME_CODE) {
        query += ` AND UPPER(TAX_REGIME_CODE) = UPPER(:${paramIndex})`;
        params.push(TAX_REGIME_CODE);
        paramIndex++;
      }

      if (ACTIVE_FLAG) {
        query += ` AND UPPER(ACTIVE_FLAG) = UPPER(:${paramIndex})`;
        params.push(ACTIVE_FLAG);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY TAX_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} ZX tax records`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching ZX tax records:', error);
      throw error;
    }
  }

  async findZxTaxById(id: number): Promise<ZxTaxDto> {
    try {
      const query = `
        SELECT 
          TAX_ID,
          TAX_NAME,
          TAX_TYPE_CODE,
          TAX_REGIME_CODE,
          TAX_REGIME_NAME,
          TAX_JURISDICTION_CODE,
          TAX_JURISDICTION_NAME,
          TAX_RATE,
          TAX_RATE_ID,
          ENABLED_FLAG,
          TO_CHAR(EFFECTIVE_FROM, 'YYYY-MM-DD') AS EFFECTIVE_FROM,
          TO_CHAR(EFFECTIVE_TO, 'YYYY-MM-DD') AS EFFECTIVE_TO,
          CONTENT_OWNER_ID,
          TAX_CURRENCY_CODE,
          MINIMUM_ACCOUNTABLE_UNIT,
          PRECISION,
          PERCENTAGE_RATE,
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
        FROM APPS.XTD_ZX_TAX_V
        WHERE TAX_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      if (!result.rows.length) {
        throw new Error(`ZX tax with ID ${id} not found`);
      }

      this.logger.log(`Found ZX tax with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching ZX tax with ID ${id}:`, error);
      throw error;
    }
  }

  async countZxTax(queryDto: ZxTaxQueryDto = {}): Promise<number> {
    try {
      const { TAX_ID, TAX_NAME, TAX_TYPE_CODE, TAX_REGIME_CODE, ACTIVE_FLAG } =
        queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_ZX_TAX_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TAX_ID) {
        query += ` AND TAX_ID = :${paramIndex}`;
        params.push(TAX_ID);
        paramIndex++;
      }

      if (TAX_NAME) {
        query += ` AND UPPER(TAX_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${TAX_NAME}%`);
        paramIndex++;
      }

      if (TAX_TYPE_CODE) {
        query += ` AND UPPER(TAX_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(TAX_TYPE_CODE);
        paramIndex++;
      }

      if (TAX_REGIME_CODE) {
        query += ` AND UPPER(TAX_REGIME_CODE) = UPPER(:${paramIndex})`;
        params.push(TAX_REGIME_CODE);
        paramIndex++;
      }

      if (ACTIVE_FLAG) {
        query += ` AND UPPER(ACTIVE_FLAG) = UPPER(:${paramIndex})`;
        params.push(ACTIVE_FLAG);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting ZX tax records:', error);
      throw error;
    }
  }
}
