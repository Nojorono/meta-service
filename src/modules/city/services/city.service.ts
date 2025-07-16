import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CityDto, CityQueryDto } from '../dtos/city.dtos';

@Injectable()
export class CityService {
  private readonly logger = new Logger(CityService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllCities(
    queryDto: CityQueryDto = {},
  ): Promise<CityDto[]> {
    try {
      const { provinsiCode, kotamadyaCode, kotamadyaName, page = 1, limit = 10 } = queryDto;
      
      let query = `
        SELECT 
          PROVINSI_CODE,
          KOTAMADYA_CODE,
          KOTAMADYA_NAME,
          KOTAMADYA_ENABLED_FLAG,
          TO_CHAR(KOTAMADYA_START_DATE, 'YYYY-MM-DD') AS KOTAMADYA_START_DATE,
          TO_CHAR(KOTAMADYA_END_DATE, 'YYYY-MM-DD') AS KOTAMADYA_END_DATE
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (provinsiCode) {
        query += ` AND UPPER(PROVINSI_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsiCode}%`);
        paramIndex++;
      }

      if (kotamadyaCode) {
        query += ` AND UPPER(KOTAMADYA_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kotamadyaCode}%`);
        paramIndex++;
      }

      if (kotamadyaName) {
        query += ` AND UPPER(KOTAMADYA_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kotamadyaName}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY PROVINSI_CODE, KOTAMADYA_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} cities`);
      return result.rows as CityDto[];
    } catch (error) {
      this.logger.error('Error finding cities:', error);
      throw error;
    }
  }

  async findCityByCode(kotamadyaCode: string): Promise<CityDto | null> {
    try {
      const query = `
        SELECT 
          PROVINSI_CODE,
          KOTAMADYA_CODE,
          KOTAMADYA_NAME,
          KOTAMADYA_ENABLED_FLAG,
          TO_CHAR(KOTAMADYA_START_DATE, 'YYYY-MM-DD') AS KOTAMADYA_START_DATE,
          TO_CHAR(KOTAMADYA_END_DATE, 'YYYY-MM-DD') AS KOTAMADYA_END_DATE
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE KOTAMADYA_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [kotamadyaCode]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`City not found for code: ${kotamadyaCode}`);
        return null;
      }

      this.logger.log(`Found city: ${kotamadyaCode}`);
      return result.rows[0] as CityDto;
    } catch (error) {
      this.logger.error(`Error finding city by code ${kotamadyaCode}:`, error);
      throw error;
    }
  }

  async findCitiesByProvinceCode(provinsiCode: string): Promise<CityDto[]> {
    try {
      const query = `
        SELECT 
          PROVINSI_CODE,
          KOTAMADYA_CODE,
          KOTAMADYA_NAME,
          KOTAMADYA_ENABLED_FLAG,
          TO_CHAR(KOTAMADYA_START_DATE, 'YYYY-MM-DD') AS KOTAMADYA_START_DATE,
          TO_CHAR(KOTAMADYA_END_DATE, 'YYYY-MM-DD') AS KOTAMADYA_END_DATE
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE PROVINSI_CODE = :1
        ORDER BY KOTAMADYA_CODE
      `;

      const result = await this.oracleService.executeQuery(query, [provinsiCode]);
      
      this.logger.log(`Found ${result.rows.length} cities for province: ${provinsiCode}`);
      return result.rows as CityDto[];
    } catch (error) {
      this.logger.error(`Error finding cities by province code ${provinsiCode}:`, error);
      throw error;
    }
  }

  async getCityCount(queryDto: CityQueryDto = {}): Promise<number> {
    try {
      const { provinsiCode, kotamadyaCode, kotamadyaName } = queryDto;
      
      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (provinsiCode) {
        query += ` AND UPPER(PROVINSI_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${provinsiCode}%`);
        paramIndex++;
      }

      if (kotamadyaCode) {
        query += ` AND UPPER(KOTAMADYA_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kotamadyaCode}%`);
        paramIndex++;
      }

      if (kotamadyaName) {
        query += ` AND UPPER(KOTAMADYA_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${kotamadyaName}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;
      
      this.logger.log(`Total cities count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting city count:', error);
      throw error;
    }
  }
}
