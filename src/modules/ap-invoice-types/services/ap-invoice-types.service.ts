import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { ApInvoiceTypesDto, ApInvoiceTypesQueryDto } from '../dtos/ap-invoice-types.dtos';

@Injectable()
export class ApInvoiceTypesService {
  private readonly logger = new Logger(ApInvoiceTypesService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllApInvoiceTypes(
    queryDto: ApInvoiceTypesQueryDto = {},
  ): Promise<ApInvoiceTypesDto[]> {
    try {
      const { 
        INVOICE_TYPE_CODE, 
        INVOICE_TYPE_NAME, 
        DESCRIPTION, 
        ENABLED_FLAG, 
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          INVOICE_TYPE_CODE,
          INVOICE_TYPE_NAME,
          DESCRIPTION, 
          ENABLED_FLAG, 
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          LAST_UPDATE_DATE,
          INVOICE_TYPE_DMS
        FROM APPS.XTD_AP_INVOICE_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (INVOICE_TYPE_CODE) {
        query += ` AND UPPER(INVOICE_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(INVOICE_TYPE_CODE);
        paramIndex++;
      }

      if (INVOICE_TYPE_NAME) {
        query += ` AND UPPER(INVOICE_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${INVOICE_TYPE_NAME}%`);
        paramIndex++;
      }

      if (DESCRIPTION) {
        query += ` AND UPPER(DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${DESCRIPTION}%`);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY INVOICE_TYPE_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset);      // :paramIndex
      params.push(limit);       // :paramIndex + 1

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} AP invoice types`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching AP invoice types:', error);
      throw error;
    }
  }

  async findApInvoiceTypeByCode(code: string): Promise<ApInvoiceTypesDto> {
    try {
      const query = `
        SELECT 
          INVOICE_TYPE_CODE,
          INVOICE_TYPE_NAME,
          DESCRIPTION, 
          ENABLED_FLAG, 
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          LAST_UPDATE_DATE,
          INVOICE_TYPE_DMS
        FROM APPS.XTD_AP_INVOICE_TYPES_V
        WHERE INVOICE_TYPE_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [code]);
      
      if (!result.rows.length) {
        throw new Error(`AP invoice type with code ${code} not found`);
      }
      
      this.logger.log(`Found AP invoice type with code: ${code}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching AP invoice type with code ${code}:`, error);
      throw error;
    }
  }

  async countApInvoiceTypes(queryDto: ApInvoiceTypesQueryDto = {}): Promise<number> {
    try {
      const { 
        INVOICE_TYPE_CODE, 
        INVOICE_TYPE_NAME, 
        DESCRIPTION, 
        ENABLED_FLAG 
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AP_INVOICE_TYPES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (INVOICE_TYPE_CODE) {
        query += ` AND UPPER(INVOICE_TYPE_CODE) = UPPER(:${paramIndex})`;
        params.push(INVOICE_TYPE_CODE);
        paramIndex++;
      }

      if (INVOICE_TYPE_NAME) {
        query += ` AND UPPER(INVOICE_TYPE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${INVOICE_TYPE_NAME}%`);
        paramIndex++;
      }

      if (DESCRIPTION) {
        query += ` AND UPPER(DESCRIPTION) = UPPER(:${paramIndex})`;
        params.push(DESCRIPTION);
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
      this.logger.error('Error counting AP invoice types:', error);
      throw error;
    }
  }
}