import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { DistrictDto, DistrictQueryDto } from '../dtos/district.dtos';

@Injectable()
export class DistrictService {
  private readonly logger = new Logger(DistrictService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllDistricts(
    queryDto: DistrictQueryDto = {},
  ): Promise<DistrictDto[]> {
    try {
      const {
        kotamadyaCode,
        kecamatanCode,
        kecamatanName,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          KOTAMADYA_CODE,
          KECAMATAN_CODE,
          KECAMATAN,
          KECAMATAN_ENABLED_FLAG,
          KECAMATAN_START_DATE_ACTIVE,
          KECAMATAN_END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_FND_KECAMATAN_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (kotamadyaCode) {
        query += ` AND UPPER(KOTAMADYA_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kotamadyaCode}%`);
        paramIndex++;
      }

      if (kecamatanCode) {
        query += ` AND UPPER(KECAMATAN_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatanCode}%`);
        paramIndex++;
      }

      if (kecamatanName) {
        query += ` AND UPPER(KECAMATAN) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatanName}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY KOTAMADYA_CODE, KECAMATAN_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} districts`);
      return result.rows as DistrictDto[];
    } catch (error) {
      this.logger.error('Error finding districts:', error);
      throw error;
    }
  }

  async findDistrictByCode(kecamatanCode: string): Promise<DistrictDto | null> {
    try {
      const query = `
        SELECT 
          KOTAMADYA_CODE,
          KECAMATAN_CODE,
          KECAMATAN,
          KECAMATAN_ENABLED_FLAG,
          KECAMATAN_START_DATE_ACTIVE,
          KECAMATAN_END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_FND_KECAMATAN_V
        WHERE KECAMATAN_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        kecamatanCode,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(`District not found for code: ${kecamatanCode}`);
        return null;
      }

      this.logger.log(`Found district: ${kecamatanCode}`);
      return result.rows[0] as DistrictDto;
    } catch (error) {
      this.logger.error(
        `Error finding district by code ${kecamatanCode}:`,
        error,
      );
      throw error;
    }
  }

  async findDistrictsByCityCode(kotamadyaCode: string): Promise<DistrictDto[]> {
    try {
      const query = `
        SELECT 
          KOTAMADYA_CODE,
          KECAMATAN_CODE,
          KECAMATAN,
          KECAMATAN_ENABLED_FLAG,
          KECAMATAN_START_DATE_ACTIVE,
          KECAMATAN_END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_FND_KECAMATAN_V
        WHERE KOTAMADYA_CODE = :1
        ORDER BY KECAMATAN_CODE
      `;

      const result = await this.oracleService.executeQuery(query, [
        kotamadyaCode,
      ]);

      this.logger.log(
        `Found ${result.rows.length} districts for city: ${kotamadyaCode}`,
      );
      return result.rows as DistrictDto[];
    } catch (error) {
      this.logger.error(
        `Error finding districts by city code ${kotamadyaCode}:`,
        error,
      );
      throw error;
    }
  }

  async getDistrictCount(queryDto: DistrictQueryDto = {}): Promise<number> {
    try {
      const { kotamadyaCode, kecamatanCode, kecamatanName } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_FND_KECAMATAN_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (kotamadyaCode) {
        query += ` AND UPPER(KOTAMADYA_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kotamadyaCode}%`);
        paramIndex++;
      }

      if (kecamatanCode) {
        query += ` AND UPPER(KECAMATAN_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatanCode}%`);
        paramIndex++;
      }

      if (kecamatanName) {
        query += ` AND UPPER(KECAMATAN) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kecamatanName}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;

      this.logger.log(`Total districts count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting district count:', error);
      throw error;
    }
  }
}
