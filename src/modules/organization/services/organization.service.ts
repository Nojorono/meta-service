import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  OrganizationDto,
  OrganizationQueryDto,
} from '../dtos/organization.dtos';

@Injectable()
export class OrganizationService {
  private readonly logger = new Logger(OrganizationService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllOrganizations(
    queryDto: OrganizationQueryDto = {},
  ): Promise<OrganizationDto[]> {
    try {
      const {
        organizationCode,
        organizationName,
        organizationType,
        locationCode,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          ORGANIZATION_ID,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          PARENT_ORGANIZATION_ID,
          LOCATION_CODE,
          MANAGER_EMPLOYEE_ID
        FROM APPS.XTD_HR_ORGANIZATIONS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      if (organizationName) {
        query += ` AND UPPER(ORGANIZATION_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationName}%`);
        paramIndex++;
      }

      if (organizationType) {
        query += ` AND UPPER(ORGANIZATION_TYPE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationType}%`);
        paramIndex++;
      }

      if (locationCode) {
        query += ` AND UPPER(LOCATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${locationCode}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY ORGANIZATION_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} organizations`);
      return result.rows as OrganizationDto[];
    } catch (error) {
      this.logger.error('Error finding organizations:', error);
      throw error;
    }
  }

  async findOrganizationById(
    organizationId: number,
  ): Promise<OrganizationDto | null> {
    try {
      const query = `
        SELECT 
          ORGANIZATION_ID,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          PARENT_ORGANIZATION_ID,
          LOCATION_CODE,
          MANAGER_EMPLOYEE_ID
        FROM APPS.XTD_HR_ORGANIZATIONS_V
        WHERE ORGANIZATION_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        organizationId,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(`Organization not found for ID: ${organizationId}`);
        return null;
      }

      this.logger.log(`Found organization: ${organizationId}`);
      return result.rows[0] as OrganizationDto;
    } catch (error) {
      this.logger.error(
        `Error finding organization by ID ${organizationId}:`,
        error,
      );
      throw error;
    }
  }

  async findOrganizationByCode(
    organizationCode: string,
  ): Promise<OrganizationDto | null> {
    try {
      const query = `
        SELECT 
          ORGANIZATION_ID,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          PARENT_ORGANIZATION_ID,
          LOCATION_CODE,
          MANAGER_EMPLOYEE_ID
        FROM APPS.XTD_HR_ORGANIZATIONS_V
        WHERE ORGANIZATION_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        organizationCode,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(
          `Organization not found for code: ${organizationCode}`,
        );
        return null;
      }

      this.logger.log(`Found organization: ${organizationCode}`);
      return result.rows[0] as OrganizationDto;
    } catch (error) {
      this.logger.error(
        `Error finding organization by code ${organizationCode}:`,
        error,
      );
      throw error;
    }
  }

  async getOrganizationCount(
    queryDto: OrganizationQueryDto = {},
  ): Promise<number> {
    try {
      const {
        organizationCode,
        organizationName,
        organizationType,
        locationCode,
      } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_HR_ORGANIZATIONS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      if (organizationName) {
        query += ` AND UPPER(ORGANIZATION_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationName}%`);
        paramIndex++;
      }

      if (organizationType) {
        query += ` AND UPPER(ORGANIZATION_TYPE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationType}%`);
        paramIndex++;
      }

      if (locationCode) {
        query += ` AND UPPER(LOCATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${locationCode}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;

      this.logger.log(`Total organizations count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting organization count:', error);
      throw error;
    }
  }
}
