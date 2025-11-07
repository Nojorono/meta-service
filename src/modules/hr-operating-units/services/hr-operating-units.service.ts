import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  HrOperatingUnitsDto,
  HrOperatingUnitsQueryDto,
} from '../dtos/hr-operating-units.dtos';

@Injectable()
export class HrOperatingUnitsService {
  private readonly logger = new Logger(HrOperatingUnitsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllOperatingUnits(
    queryDto: HrOperatingUnitsQueryDto = {},
  ): Promise<HrOperatingUnitsDto[]> {
    try {
      const {
        businessGroupId,
        locationCode,
        orgName,
        orgCode,
        shortCode,
        usableFlag,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          BUSINESS_GROUP_ID,
          TO_CHAR(DATE_FROM, 'YYYY-MM-DD') AS DATE_FROM,
          TO_CHAR(DATE_TO, 'YYYY-MM-DD') AS DATE_TO,
          DEFAULT_LEGAL_CONTEXT_ID,
          LOCATION_CODE,
          LOCATION_DESCRIPTION,
          NAME,
          ORG_CODE,
          ORG_ID,
          ORG_NAME,
          ORGANIZATION_ID,
          SET_OF_BOOKS_ID,
          SHORT_CODE,
          USABLE_FLAG
        FROM APPS.XTD_HR_OPERATING_UNITS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (businessGroupId) {
        query += ` AND BUSINESS_GROUP_ID = :${paramIndex}`;
        params.push(businessGroupId);
        paramIndex++;
      }

      if (locationCode) {
        query += ` AND UPPER(LOCATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${locationCode}%`);
        paramIndex++;
      }

      if (orgName) {
        query += ` AND UPPER(ORG_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${orgName}%`);
        paramIndex++;
      }

      if (orgCode) {
        query += ` AND UPPER(ORG_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${orgCode}%`);
        paramIndex++;
      }

      if (shortCode) {
        query += ` AND UPPER(SHORT_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${shortCode}%`);
        paramIndex++;
      }

      if (usableFlag) {
        query += ` AND UPPER(USABLE_FLAG) = UPPER(:${paramIndex})`;
        params.push(usableFlag);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY ORG_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} operating units`);
      return result.rows as HrOperatingUnitsDto[];
    } catch (error) {
      this.logger.error('Error finding operating units:', error);
      throw error;
    }
  }

  async findOperatingUnitById(orgId: number): Promise<HrOperatingUnitsDto | null> {
    try {
      const query = `
        SELECT 
          BUSINESS_GROUP_ID,
          TO_CHAR(DATE_FROM, 'YYYY-MM-DD') AS DATE_FROM,
          TO_CHAR(DATE_TO, 'YYYY-MM-DD') AS DATE_TO,
          DEFAULT_LEGAL_CONTEXT_ID,
          LOCATION_CODE,
          LOCATION_DESCRIPTION,
          NAME,
          ORG_CODE,
          ORG_ID,
          ORG_NAME,
          ORGANIZATION_ID,
          SET_OF_BOOKS_ID,
          SHORT_CODE,
          USABLE_FLAG
        FROM APPS.XTD_HR_OPERATING_UNITS_V
        WHERE ORG_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [orgId]);

      if (result.rows.length === 0) {
        this.logger.warn(`Operating unit not found for ORG_ID: ${orgId}`);
        return null;
      }

      this.logger.log(`Found operating unit: ${orgId}`);
      return result.rows[0] as HrOperatingUnitsDto;
    } catch (error) {
      this.logger.error(
        `Error finding operating unit by ID ${orgId}:`,
        error,
      );
      throw error;
    }
  }

  async findOperatingUnitByCode(
    orgCode: string,
  ): Promise<HrOperatingUnitsDto | null> {
    try {
      const query = `
        SELECT 
          BUSINESS_GROUP_ID,
          TO_CHAR(DATE_FROM, 'YYYY-MM-DD') AS DATE_FROM,
          TO_CHAR(DATE_TO, 'YYYY-MM-DD') AS DATE_TO,
          DEFAULT_LEGAL_CONTEXT_ID,
          LOCATION_CODE,
          LOCATION_DESCRIPTION,
          NAME,
          ORG_CODE,
          ORG_ID,
          ORG_NAME,
          ORGANIZATION_ID,
          SET_OF_BOOKS_ID,
          SHORT_CODE,
          USABLE_FLAG
        FROM APPS.XTD_HR_OPERATING_UNITS_V
        WHERE ORG_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [orgCode]);

      if (result.rows.length === 0) {
        this.logger.warn(`Operating unit not found for code: ${orgCode}`);
        return null;
      }

      this.logger.log(`Found operating unit: ${orgCode}`);
      return result.rows[0] as HrOperatingUnitsDto;
    } catch (error) {
      this.logger.error(
        `Error finding operating unit by code ${orgCode}:`,
        error,
      );
      throw error;
    }
  }

  async getOperatingUnitsCount(
    queryDto: HrOperatingUnitsQueryDto = {},
  ): Promise<number> {
    try {
      const {
        businessGroupId,
        locationCode,
        orgName,
        orgCode,
        shortCode,
        usableFlag,
      } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_HR_OPERATING_UNITS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (businessGroupId) {
        query += ` AND BUSINESS_GROUP_ID = :${paramIndex}`;
        params.push(businessGroupId);
        paramIndex++;
      }

      if (locationCode) {
        query += ` AND UPPER(LOCATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${locationCode}%`);
        paramIndex++;
      }

      if (orgName) {
        query += ` AND UPPER(ORG_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${orgName}%`);
        paramIndex++;
      }

      if (orgCode) {
        query += ` AND UPPER(ORG_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${orgCode}%`);
        paramIndex++;
      }

      if (shortCode) {
        query += ` AND UPPER(SHORT_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${shortCode}%`);
        paramIndex++;
      }

      if (usableFlag) {
        query += ` AND UPPER(USABLE_FLAG) = UPPER(:${paramIndex})`;
        params.push(usableFlag);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;

      this.logger.log(`Total operating units count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting operating units count:', error);
      throw error;
    }
  }
}

