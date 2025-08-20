import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CurrencyDto, CurrencyQueryDto } from '../dtos/currency.dtos';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllCurrencies(
    queryDto: CurrencyQueryDto = {},
  ): Promise<CurrencyDto[]> {
    try {
      const {
        CURRENCY_CODE,
        NAME,
        ENABLED_FLAG,
        PAGE = 1,
        LIMIT = 10,
      } = queryDto;

      let query = `
        SELECT 
          *
        FROM APPS.XTD_FND_CURRENCIES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (CURRENCY_CODE) {
        query += ` AND UPPER(CURRENCY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CURRENCY_CODE}%`);
        paramIndex++;
      }

      if (NAME) {
        query += ` AND UPPER(NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${NAME}%`);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      // Add pagination
      const offset = (PAGE - 1) * LIMIT;
      query += ` ORDER BY CURRENCY_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, LIMIT);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} currencies`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching currencies:', error);
      throw error;
    }
  }

  async findCurrencyByCode(code: string): Promise<CurrencyDto> {
    try {
      const query = `
        SELECT 
          CURRENCY_CODE,
          NAME,
          ENABLED_FLAG,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_FND_CURRENCIES_V
        WHERE UPPER(CURRENCY_CODE) = UPPER(:1)
      `;

      const result = await this.oracleService.executeQuery(query, [code]);

      this.logger.log(`Found currency with code: ${code}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching currency with code ${code}:`, error);
      throw error;
    }
  }

  async countCurrencies(queryDto: CurrencyQueryDto = {}): Promise<number> {
    try {
      const { CURRENCY_CODE, NAME, ENABLED_FLAG } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_FND_CURRENCIES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (CURRENCY_CODE) {
        query += ` AND UPPER(CURRENCY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CURRENCY_CODE}%`);
        paramIndex++;
      }

      if (NAME) {
        query += ` AND UPPER(NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${NAME}%`);
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
      this.logger.error('Error counting currencies:', error);
      throw error;
    }
  }
}
