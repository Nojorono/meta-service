import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CoaExpenseDto, CoaExpenseQueryDto } from '../dtos/coa-expense.dtos';

@Injectable()
export class CoaExpenseService {
  private readonly logger = new Logger(CoaExpenseService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllCoaExpenses(
    queryDto: CoaExpenseQueryDto = {},
  ): Promise<CoaExpenseDto[]> {
    try {
      const { 
        expenseName, 
        coaCombinations, 
        fpprTypeCode, 
        organizationCode, 
        enabledFlag, 
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          CODE_COMBINATION_ID,
          EXPENSE_NAME,
          COA_COMBINATIONS,
          FPPR_TYPE_CODE,
          ORGANIZATION_CODE,
          ENABLED_FLAG,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AP_COA_EXPENSES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (expenseName) {
        query += ` AND UPPER(EXPENSE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${expenseName}%`);
        paramIndex++;
      }

      if (coaCombinations) {
        query += ` AND UPPER(COA_COMBINATIONS) LIKE UPPER(:${paramIndex})`;
        params.push(`%${coaCombinations}%`);
        paramIndex++;
      }

      if (fpprTypeCode) {
        query += ` AND UPPER(FPPR_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(fpprTypeCode);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(organizationCode);
        paramIndex++;
      }

      if (enabledFlag) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(enabledFlag);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY CODE_COMBINATION_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} COA expenses`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching COA expenses:', error);
      throw error;
    }
  }

  async findCoaExpenseById(id: number): Promise<CoaExpenseDto> {
    try {
      const query = `
        SELECT 
          CODE_COMBINATION_ID,
          EXPENSE_NAME,
          COA_COMBINATIONS,
          FPPR_TYPE_CODE,
          ORGANIZATION_CODE,
          ENABLED_FLAG,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AP_COA_EXPENSES_V
        WHERE CODE_COMBINATION_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      
      if (!result.rows.length) {
        throw new Error(`COA expense with ID ${id} not found`);
      }
      
      this.logger.log(`Found COA expense with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching COA expense with ID ${id}:`, error);
      throw error;
    }
  }

  async countCoaExpenses(queryDto: CoaExpenseQueryDto = {}): Promise<number> {
    try {
      const { 
        expenseName, 
        coaCombinations, 
        fpprTypeCode, 
        organizationCode, 
        enabledFlag 
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AP_COA_EXPENSES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (expenseName) {
        query += ` AND UPPER(EXPENSE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${expenseName}%`);
        paramIndex++;
      }

      if (coaCombinations) {
        query += ` AND UPPER(COA_COMBINATIONS) LIKE UPPER(:${paramIndex})`;
        params.push(`%${coaCombinations}%`);
        paramIndex++;
      }

      if (fpprTypeCode) {
        query += ` AND UPPER(FPPR_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(fpprTypeCode);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(organizationCode);
        paramIndex++;
      }

      if (enabledFlag) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(enabledFlag);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      
      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting COA expenses:', error);
      throw error;
    }
  }
}
