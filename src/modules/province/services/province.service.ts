import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { ProvinceDto, ProvinceQueryDto } from '../dtos/province.dtos';

@Injectable()
export class ProvinceService {
  private readonly logger = new Logger(ProvinceService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllProvinces(
    queryDto: ProvinceQueryDto = {},
  ): Promise<ProvinceDto[]> {
    try {
      const { provinsiCode, provinsiName, page = 1, limit = 10 } = queryDto;

      let query = `
        SELECT 
          PROVINSI_CODE,
          PROVINSI_NAME,
          PROVINSI_ENABLED_FLAG,
          TO_CHAR(PROVINSI_START_DATE, 'YYYY-MM-DD') AS PROVINSI_START_DATE,
          TO_CHAR(PROVINSI_END_DATE, 'YYYY-MM-DD') AS PROVINSI_END_DATE
        FROM APPS.XTD_FND_PROVINSI_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (provinsiCode) {
        query += ` AND UPPER(PROVINSI_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsiCode}%`);
        paramIndex++;
      }

      if (provinsiName) {
        query += ` AND UPPER(PROVINSI_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsiName}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY PROVINSI_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} provinces`);
      return result.rows as ProvinceDto[];
    } catch (error) {
      this.logger.error('Error finding provinces:', error);
      throw error;
    }
  }

  async findProvinceByCode(provinsiCode: string): Promise<ProvinceDto | null> {
    try {
      const query = `
        SELECT 
          PROVINSI_CODE,
          PROVINSI_NAME,
          PROVINSI_ENABLED_FLAG,
          TO_CHAR(PROVINSI_START_DATE, 'YYYY-MM-DD') AS PROVINSI_START_DATE,
          TO_CHAR(PROVINSI_END_DATE, 'YYYY-MM-DD') AS PROVINSI_END_DATE
        FROM APPS.XTD_FND_PROVINSI_V
        WHERE PROVINSI_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        provinsiCode,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(`Province not found for code: ${provinsiCode}`);
        return null;
      }

      this.logger.log(`Found province: ${provinsiCode}`);
      return result.rows[0] as ProvinceDto;
    } catch (error) {
      this.logger.error(
        `Error finding province by code ${provinsiCode}:`,
        error,
      );
      throw error;
    }
  }

  async getProvinceCount(queryDto: ProvinceQueryDto = {}): Promise<number> {
    try {
      const { provinsiCode, provinsiName } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_FND_PROVINSI_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (provinsiCode) {
        query += ` AND UPPER(PROVINSI_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsiCode}%`);
        paramIndex++;
      }

      if (provinsiName) {
        query += ` AND UPPER(PROVINSI_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsiName}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;

      this.logger.log(`Total provinces count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting province count:', error);
      throw error;
    }
  }
}
