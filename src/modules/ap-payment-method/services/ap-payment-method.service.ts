import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  ApPaymentMethodDto,
  ApPaymentMethodQueryDto,
} from '../dtos/ap-payment-method.dtos';

@Injectable()
export class ApPaymentMethodService {
  private readonly logger = new Logger(ApPaymentMethodService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllPaymentMethods(
    queryDto: ApPaymentMethodQueryDto = {},
  ): Promise<ApPaymentMethodDto[]> {
    try {
      const {
        apPaymentMethodName,
        apPaymentMethodCode,
        organizationCode,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          *
        FROM APPS.XTD_AP_PAYMENT_METHODS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (apPaymentMethodName) {
        query += ` AND UPPER(PAYMENT_METHOD_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${apPaymentMethodName}%`);
        paramIndex++;
      }

      if (apPaymentMethodCode) {
        query += ` AND UPPER(PAYMENT_METHOD_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${apPaymentMethodCode}%`);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${organizationCode}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY PAYMENT_METHOD_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} payment methods`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async countPaymentMethods(
    queryDto: ApPaymentMethodQueryDto = {},
  ): Promise<number> {
    try {
      const { apPaymentMethodName, apPaymentMethodCode, organizationCode } =
        queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AP_PAYMENT_METHODS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (apPaymentMethodName) {
        query += ` AND UPPER(PAYMENT_METHOD_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${apPaymentMethodName}%`);
        paramIndex++;
      }

      if (apPaymentMethodCode) {
        query += ` AND UPPER(PAYMENT_METHOD_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${apPaymentMethodCode}%`);
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
      this.logger.error('Error counting payment methods:', error);
      throw error;
    }
  }
}
