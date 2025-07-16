import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { PositionDto, PositionQueryDto } from '../dtos/position.dtos';

@Injectable()
export class PositionService {
  private readonly logger = new Logger(PositionService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllPositions(
    queryDto: PositionQueryDto = {},
  ): Promise<PositionDto[]> {
    try {
      const { positionCode, positionName, positionLevel, positionGroup, organizationId, page = 1, limit = 10 } = queryDto;
      
      let query = `
        SELECT 
          POSITION_ID,
          POSITION_CODE,
          POSITION_NAME,
          POSITION_TITLE,
          POSITION_LEVEL,
          POSITION_GROUP,
          ORGANIZATION_ID,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          JOB_DESCRIPTION
        FROM APPS.XTD_HR_POSITIONS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (positionCode) {
        query += ` AND UPPER(POSITION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionCode}%`);
        paramIndex++;
      }

      if (positionName) {
        query += ` AND UPPER(POSITION_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionName}%`);
        paramIndex++;
      }

      if (positionLevel) {
        query += ` AND UPPER(POSITION_LEVEL) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionLevel}%`);
        paramIndex++;
      }

      if (positionGroup) {
        query += ` AND UPPER(POSITION_GROUP) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionGroup}%`);
        paramIndex++;
      }

      if (organizationId) {
        query += ` AND ORGANIZATION_ID = :${paramIndex}`;
        params.push(organizationId);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY POSITION_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} positions`);
      return result.rows as PositionDto[];
    } catch (error) {
      this.logger.error('Error finding positions:', error);
      throw error;
    }
  }

  async findPositionById(positionId: number): Promise<PositionDto | null> {
    try {
      const query = `
        SELECT 
          POSITION_ID,
          POSITION_CODE,
          POSITION_NAME,
          POSITION_TITLE,
          POSITION_LEVEL,
          POSITION_GROUP,
          ORGANIZATION_ID,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          JOB_DESCRIPTION
        FROM APPS.XTD_HR_POSITIONS_V
        WHERE POSITION_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [positionId]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Position not found for ID: ${positionId}`);
        return null;
      }

      this.logger.log(`Found position: ${positionId}`);
      return result.rows[0] as PositionDto;
    } catch (error) {
      this.logger.error(`Error finding position by ID ${positionId}:`, error);
      throw error;
    }
  }

  async findPositionByCode(positionCode: string): Promise<PositionDto | null> {
    try {
      const query = `
        SELECT 
          POSITION_ID,
          POSITION_CODE,
          POSITION_NAME,
          POSITION_TITLE,
          POSITION_LEVEL,
          POSITION_GROUP,
          ORGANIZATION_ID,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          JOB_DESCRIPTION
        FROM APPS.XTD_HR_POSITIONS_V
        WHERE POSITION_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [positionCode]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Position not found for code: ${positionCode}`);
        return null;
      }

      this.logger.log(`Found position: ${positionCode}`);
      return result.rows[0] as PositionDto;
    } catch (error) {
      this.logger.error(`Error finding position by code ${positionCode}:`, error);
      throw error;
    }
  }

  async findPositionsByOrganizationId(organizationId: number): Promise<PositionDto[]> {
    try {
      const query = `
        SELECT 
          POSITION_ID,
          POSITION_CODE,
          POSITION_NAME,
          POSITION_TITLE,
          POSITION_LEVEL,
          POSITION_GROUP,
          ORGANIZATION_ID,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          JOB_DESCRIPTION
        FROM APPS.XTD_HR_POSITIONS_V
        WHERE ORGANIZATION_ID = :1
        ORDER BY POSITION_CODE
      `;

      const result = await this.oracleService.executeQuery(query, [organizationId]);
      
      this.logger.log(`Found ${result.rows.length} positions for organization: ${organizationId}`);
      return result.rows as PositionDto[];
    } catch (error) {
      this.logger.error(`Error finding positions by organization ID ${organizationId}:`, error);
      throw error;
    }
  }

  async getPositionCount(queryDto: PositionQueryDto = {}): Promise<number> {
    try {
      const { positionCode, positionName, positionLevel, positionGroup, organizationId } = queryDto;
      
      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_HR_POSITIONS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (positionCode) {
        query += ` AND UPPER(POSITION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionCode}%`);
        paramIndex++;
      }

      if (positionName) {
        query += ` AND UPPER(POSITION_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionName}%`);
        paramIndex++;
      }

      if (positionLevel) {
        query += ` AND UPPER(POSITION_LEVEL) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionLevel}%`);
        paramIndex++;
      }

      if (positionGroup) {
        query += ` AND UPPER(POSITION_GROUP) LIKE UPPER(:${paramIndex})`;
        params.push(`%${positionGroup}%`);
        paramIndex++;
      }

      if (organizationId) {
        query += ` AND ORGANIZATION_ID = :${paramIndex}`;
        params.push(organizationId);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;
      
      this.logger.log(`Total positions count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting position count:', error);
      throw error;
    }
  }
}
