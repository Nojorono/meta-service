import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CityDto, CityQueryDto } from '../dtos/city.dtos';

@Injectable()
export class CityService {
  private readonly logger = new Logger(CityService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllCities(queryDto: CityQueryDto = {}): Promise<CityDto[]> {
    try {
      const {
        PROVINSI_CODE,
        KOTAMADYA_CODE,
        KOTAMADYA,
        PAGE = 1,
        LIMIT = 10,
      } = queryDto;

      let query = `
        SELECT 
          KOTAMADYA_CODE,
          KOTAMADYA,
          KOTAMADYA_ENABLED_FLAG,
          PROVINSI_CODE,
          KOTAMADYA_START_DATE_ACTIVE,
          KOTAMADYA_END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (PROVINSI_CODE) {
        query += ` AND UPPER(PROVINSI_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${PROVINSI_CODE}%`);
        paramIndex++;
      }

      if (KOTAMADYA_CODE) {
        query += ` AND UPPER(KOTAMADYA_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${KOTAMADYA_CODE}%`);
        paramIndex++;
      }

      if (KOTAMADYA) {
        query += ` AND UPPER(KOTAMADYA) LIKE UPPER(:${paramIndex})`;
        params.push(`%${KOTAMADYA}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (PAGE - 1) * LIMIT;
      query += ` ORDER BY PROVINSI_CODE, KOTAMADYA_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, LIMIT);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} cities`);
      return result.rows as CityDto[];
    } catch (error) {
      this.logger.error('Error finding cities:', error);
      throw error;
    }
  }

  async findCityByCode(KOTAMADYA_CODE: string): Promise<CityDto | null> {
    try {
      const query = `
        SELECT 
          KOTAMADYA_CODE,
          KOTAMADYA,
          KOTAMADYA_ENABLED_FLAG,
          PROVINSI_CODE,
          KOTAMADYA_START_DATE_ACTIVE,
          KOTAMADYA_END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE KOTAMADYA_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        KOTAMADYA_CODE,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(`City not found for code: ${KOTAMADYA_CODE}`);
        return null;
      }

      this.logger.log(`Found city: ${KOTAMADYA_CODE}`);
      return result.rows[0] as CityDto;
    } catch (error) {
      this.logger.error(`Error finding city by code ${KOTAMADYA_CODE}:`, error);
      throw error;
    }
  }

  async findCitiesByProvinceCode(PROVINSI_CODE: string): Promise<CityDto[]> {
    try {
      const query = `
        SELECT 
          KOTAMADYA_CODE,
          KOTAMADYA,
          KOTAMADYA_ENABLED_FLAG,
          PROVINSI_CODE,
          KOTAMADYA_START_DATE_ACTIVE,
          KOTAMADYA_END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE PROVINSI_CODE = :1
        ORDER BY KOTAMADYA_CODE
      `;

      const result = await this.oracleService.executeQuery(query, [
        PROVINSI_CODE,
      ]);

      this.logger.log(
        `Found ${result.rows.length} cities for province: ${PROVINSI_CODE}`,
      );
      return result.rows as CityDto[];
    } catch (error) {
      this.logger.error(
        `Error finding cities by province code ${PROVINSI_CODE}:`,
        error,
      );
      throw error;
    }
  }

  async getCityCount(queryDto: CityQueryDto = {}): Promise<number> {
    try {
      const { PROVINSI_CODE, KOTAMADYA_CODE, KOTAMADYA } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_FND_KOTAMADYA_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (PROVINSI_CODE) {
        query += ` AND UPPER(PROVINSI_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${PROVINSI_CODE}%`);
        paramIndex++;
      }

      if (KOTAMADYA_CODE) {
        query += ` AND UPPER(KOTAMADYA_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${KOTAMADYA_CODE}%`);
        paramIndex++;
      }

      if (KOTAMADYA) {
        query += ` AND UPPER(KOTAMADYA) LIKE UPPER(:${paramIndex})`;
        params.push(`%${KOTAMADYA}%`);
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
