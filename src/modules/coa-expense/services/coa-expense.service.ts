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
        EXPENSE_NAME,
        COA_COMBINATIONS,
        FPPR_TYPE_CODE,
        ORGANIZATION_CODE,
        ENABLED_FLAG,
        PAGE = 1,
        LIMIT = 10,
      } = queryDto;

      let query = `
        SELECT 
          EXPENSE_NAME,
          COA_COMBINATIONS,
          CODE_COMBINATION_ID,
          FPPR_TYPE_CODE,
          FPPR_TYPE_DESCRIPTION,
          ENABLED_FLAG,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_ID,
          ORG_NAME,
          ORG_ID,
          LAST_UPDATE_DATE
        FROM APPS.XTD_AP_COA_EXPENSES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (EXPENSE_NAME) {
        query += ` AND UPPER(EXPENSE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${EXPENSE_NAME}%`);
        paramIndex++;
      }

      if (COA_COMBINATIONS) {
        query += ` AND UPPER(COA_COMBINATIONS) LIKE UPPER(:${paramIndex})`;
        params.push(COA_COMBINATIONS);
        paramIndex++;
      }

      if (FPPR_TYPE_CODE) {
        query += ` AND UPPER(FPPR_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(FPPR_TYPE_CODE);
        paramIndex++;
      }

      if (ORGANIZATION_CODE) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(ORGANIZATION_CODE);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      // Add pagination
      const offset = (PAGE - 1) * LIMIT;
      query += ` ORDER BY CODE_COMBINATION_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, LIMIT);

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
          EXPENSE_NAME,
          COA_COMBINATIONS,
          CODE_COMBINATION_ID,
          FPPR_TYPE_CODE,
          FPPR_TYPE_DESCRIPTION,
          ENABLED_FLAG,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          ORGANIZATION_CODE,
          ORGANIZATION_NAME,
          ORGANIZATION_ID,
          ORG_NAME,
          ORG_ID,
          LAST_UPDATE_DATE
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
        EXPENSE_NAME,
        COA_COMBINATIONS,
        FPPR_TYPE_CODE,
        ORGANIZATION_CODE,
        ENABLED_FLAG,
      } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AP_COA_EXPENSES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (EXPENSE_NAME) {
        query += ` AND UPPER(EXPENSE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${EXPENSE_NAME}%`);
        paramIndex++;
      }

      if (COA_COMBINATIONS) {
        query += ` AND UPPER(COA_COMBINATIONS) LIKE UPPER(:${paramIndex})`;
        params.push(COA_COMBINATIONS);
        paramIndex++;
      }

      if (FPPR_TYPE_CODE) {
        query += ` AND UPPER(FPPR_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(FPPR_TYPE_CODE);
        paramIndex++;
      }

      if (ORGANIZATION_CODE) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(ORGANIZATION_CODE);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
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
