import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { SubDistrictDto, SubDistrictQueryDto } from '../dtos/sub-district.dtos';

@Injectable()
export class SubDistrictService {
  private readonly logger = new Logger(SubDistrictService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllSubDistricts(
    queryDto: SubDistrictQueryDto = {},
  ): Promise<SubDistrictDto[]> {
    try {
      const { kecamatanCode, kelurahanCode, kelurahanName, page = 1, limit = 10 } = queryDto;
      
      let query = `
        SELECT 
          KECAMATAN_CODE,
          KELURAHAN_CODE,
          KELURAHAN_NAME,
          KELURAHAN_ENABLED_FLAG,
          TO_CHAR(KELURAHAN_START_DATE, 'YYYY-MM-DD') AS KELURAHAN_START_DATE,
          TO_CHAR(KELURAHAN_END_DATE, 'YYYY-MM-DD') AS KELURAHAN_END_DATE
        FROM APPS.XTD_FND_KELURAHAN_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (kecamatanCode) {
        query += ` AND UPPER(KECAMATAN_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatanCode}%`);
        paramIndex++;
      }

      if (kelurahanCode) {
        query += ` AND UPPER(KELURAHAN_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kelurahanCode}%`);
        paramIndex++;
      }

      if (kelurahanName) {
        query += ` AND UPPER(KELURAHAN_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kelurahanName}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY KECAMATAN_CODE, KELURAHAN_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} sub-districts`);
      return result.rows as SubDistrictDto[];
    } catch (error) {
      this.logger.error('Error finding sub-districts:', error);
      throw error;
    }
  }

  async findSubDistrictByCode(kelurahanCode: string): Promise<SubDistrictDto | null> {
    try {
      const query = `
        SELECT 
          KECAMATAN_CODE,
          KELURAHAN_CODE,
          KELURAHAN_NAME,
          KELURAHAN_ENABLED_FLAG,
          TO_CHAR(KELURAHAN_START_DATE, 'YYYY-MM-DD') AS KELURAHAN_START_DATE,
          TO_CHAR(KELURAHAN_END_DATE, 'YYYY-MM-DD') AS KELURAHAN_END_DATE
        FROM APPS.XTD_FND_KELURAHAN_V
        WHERE KELURAHAN_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [kelurahanCode]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Sub-district not found for code: ${kelurahanCode}`);
        return null;
      }

      this.logger.log(`Found sub-district: ${kelurahanCode}`);
      return result.rows[0] as SubDistrictDto;
    } catch (error) {
      this.logger.error(`Error finding sub-district by code ${kelurahanCode}:`, error);
      throw error;
    }
  }

  async findSubDistrictsByDistrictCode(kecamatanCode: string): Promise<SubDistrictDto[]> {
    try {
      const query = `
        SELECT 
          KECAMATAN_CODE,
          KELURAHAN_CODE,
          KELURAHAN_NAME,
          KELURAHAN_ENABLED_FLAG,
          TO_CHAR(KELURAHAN_START_DATE, 'YYYY-MM-DD') AS KELURAHAN_START_DATE,
          TO_CHAR(KELURAHAN_END_DATE, 'YYYY-MM-DD') AS KELURAHAN_END_DATE
        FROM APPS.XTD_FND_KELURAHAN_V
        WHERE KECAMATAN_CODE = :1
        ORDER BY KELURAHAN_CODE
      `;

      const result = await this.oracleService.executeQuery(query, [kecamatanCode]);
      
      this.logger.log(`Found ${result.rows.length} sub-districts for district: ${kecamatanCode}`);
      return result.rows as SubDistrictDto[];
    } catch (error) {
      this.logger.error(`Error finding sub-districts by district code ${kecamatanCode}:`, error);
      throw error;
    }
  }

  async getSubDistrictCount(queryDto: SubDistrictQueryDto = {}): Promise<number> {
    try {
      const { kecamatanCode, kelurahanCode, kelurahanName } = queryDto;
      
      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_FND_KELURAHAN_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (kecamatanCode) {
        query += ` AND UPPER(KECAMATAN_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatanCode}%`);
        paramIndex++;
      }

      if (kelurahanCode) {
        query += ` AND UPPER(KELURAHAN_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kelurahanCode}%`);
        paramIndex++;
      }

      if (kelurahanName) {
        query += ` AND UPPER(KELURAHAN_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kelurahanName}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;
      
      this.logger.log(`Total sub-districts count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting sub-district count:', error);
      throw error;
    }
  }
}
