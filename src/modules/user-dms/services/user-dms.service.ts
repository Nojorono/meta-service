import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { UserDmsDto, UserDmsQueryDto } from '../dtos/user-dms.dtos';

@Injectable()
export class UserDmsService {
  private readonly logger = new Logger(UserDmsService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllUserDms(queryDto: UserDmsQueryDto = {}): Promise<UserDmsDto[]> {
    try {
      const { userName, description, page = 1, limit = 10 } = queryDto;

      let query = `
        SELECT 
          USER_NAME,
          USER_ID,
          TO_CHAR(START_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          DESCRIPTION
        FROM APPS.XTD_FND_USER_DMS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (userName) {
        query += ` AND UPPER(USER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${userName}%`);
        paramIndex++;
      }

      if (description) {
        query += ` AND UPPER(DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${description}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY USER_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} user DMS records`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching user DMS records:', error);
      throw error;
    }
  }

  async findUserDmsById(id: number): Promise<UserDmsDto> {
    try {
      const query = `
        SELECT 
          USER_NAME,
          USER_ID,
          TO_CHAR(START_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          DESCRIPTION
        FROM APPS.XTD_FND_USER_DMS_V
        WHERE USER_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      this.logger.log(`Found user DMS with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching user DMS with ID ${id}:`, error);
      throw error;
    }
  }

  async countUserDms(queryDto: UserDmsQueryDto = {}): Promise<number> {
    try {
      const { userName, description } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_FND_USER_DMS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (userName) {
        query += ` AND UPPER(USER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${userName}%`);
        paramIndex++;
      }

      if (description) {
        query += ` AND UPPER(DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${description}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting user DMS records:', error);
      throw error;
    }
  }
}
