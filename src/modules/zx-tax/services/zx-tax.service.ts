import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from '../../../common/services/oracle.service';
import { ZxTaxDto, ZxTaxQueryDto } from '../dtos/zx-tax.dtos';

@Injectable()
export class ZxTaxService {
  private readonly logger = new Logger(ZxTaxService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllZxTaxes(queryDto: ZxTaxQueryDto = {}): Promise<ZxTaxDto[]> {
    try {
      const { TAX_RATE_CODE, PERCENTAGE_RATE, page = 1, limit = 10 } = queryDto;

      let query = `
        SELECT 
          *
        FROM APPS.XTD_ZX_TAX_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TAX_RATE_CODE) {
        query += ` AND TAX_RATE_CODE = :${paramIndex}`;
        params.push(TAX_RATE_CODE);
        paramIndex++;
      }

      if (PERCENTAGE_RATE) {
        query += ` AND UPPER(PERCENTAGE_RATE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${PERCENTAGE_RATE}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY TAX_RATE_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} ZX tax records`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching ZX tax records:', error);
      throw error;
    }
  }

  async findZxTaxById(id: number): Promise<ZxTaxDto> {
    try {
      const query = `
        SELECT 
          *
        FROM APPS.XTD_ZX_TAX_V
        WHERE TAX_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      if (!result.rows.length) {
        throw new Error(`ZX tax with ID ${id} not found`);
      }

      this.logger.log(`Found ZX tax with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching ZX tax with ID ${id}:`, error);
      throw error;
    }
  }

  async countZxTaxes(queryDto: ZxTaxQueryDto = {}): Promise<number> {
    try {
      const { TAX_RATE_CODE, PERCENTAGE_RATE } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_ZX_TAX_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (TAX_RATE_CODE) {
        query += ` AND TAX_RATE_CODE = :${paramIndex}`;
        params.push(TAX_RATE_CODE);
        paramIndex++;
      }

      if (PERCENTAGE_RATE) {
        query += ` AND UPPER(PERCENTAGE_RATE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${PERCENTAGE_RATE}%`);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting ZX tax records:', error);
      throw error;
    }
  }
}
