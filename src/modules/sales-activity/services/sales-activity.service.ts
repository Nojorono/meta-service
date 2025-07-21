import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  SalesActivityDto,
  SalesActivityQueryDto,
} from '../dtos/sales-activity.dtos';

@Injectable()
export class SalesActivityService {
  private readonly logger = new Logger(SalesActivityService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllSalesActivities(
    queryDto: SalesActivityQueryDto = {},
  ): Promise<SalesActivityDto[]> {
    try {
      const {
        activityName,
        receiptTypeDms,
        status,
        organizationCode,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          SALES_ACTIVITY_ID,
          NAME,
          SALES_ACTIVITY_CODE,
          SALES_ACTIVITY_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AR_SALES_ACTIVITIES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (activityName) {
        query += ` AND UPPER(NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${activityName}%`);
        paramIndex++;
      }

      if (receiptTypeDms) {
        query += ` AND UPPER(SALES_ACTIVITY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${receiptTypeDms}%`);
        paramIndex++;
      }

      if (status) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(status);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY SALES_ACTIVITY_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} sales activities`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching sales activities:', error);
      throw error;
    }
  }

  async findSalesActivityById(id: number): Promise<SalesActivityDto> {
    try {
      const query = `
        SELECT 
          SALES_ACTIVITY_ID,
          NAME,
          SALES_ACTIVITY_CODE,
          SALES_ACTIVITY_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AR_SALES_ACTIVITIES_V
        WHERE SALES_ACTIVITY_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      this.logger.log(`Found sales activity with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching sales activity with ID ${id}:`, error);
      throw error;
    }
  }

  async countSalesActivities(
    queryDto: SalesActivityQueryDto = {},
  ): Promise<number> {
    try {
      const { activityName, receiptTypeDms, status, organizationCode } =
        queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AR_SALES_ACTIVITIES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (activityName) {
        query += ` AND UPPER(NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${activityName}%`);
        paramIndex++;
      }

      if (receiptTypeDms) {
        query += ` AND UPPER(SALES_ACTIVITY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${receiptTypeDms}%`);
        paramIndex++;
      }

      if (status) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(status);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting sales activities:', error);
      throw error;
    }
  }
}
