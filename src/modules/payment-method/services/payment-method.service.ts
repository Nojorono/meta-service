import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { PaymentMethodDto, PaymentMethodQueryDto } from '../dtos/payment-method.dtos';

@Injectable()
export class PaymentMethodService {
  private readonly logger = new Logger(PaymentMethodService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllPaymentMethods(
    queryDto: PaymentMethodQueryDto = {},
  ): Promise<PaymentMethodDto[]> {
    try {
      const { 
        paymentMethodName, 
        paymentMethodCode, 
        currencyCode, 
        organizationCode, 
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          PAYMENT_METHOD_ID,
          PAYMENT_METHOD_NAME,
          PAYMENT_METHOD_CODE,
          CURRENCY_CODE,
          ORGANIZATION_CODE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AP_PAYMENT_METHODS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (paymentMethodName) {
        query += ` AND UPPER(PAYMENT_METHOD_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${paymentMethodName}%`);
        paramIndex++;
      }

      if (paymentMethodCode) {
        query += ` AND UPPER(PAYMENT_METHOD_CODE) = UPPER(:${paramIndex})`;
        params.push(paymentMethodCode);
        paramIndex++;
      }

      if (currencyCode) {
        query += ` AND UPPER(CURRENCY_CODE) = UPPER(:${paramIndex})`;
        params.push(currencyCode);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(organizationCode);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY PAYMENT_METHOD_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} payment methods`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async findPaymentMethodById(id: number): Promise<PaymentMethodDto> {
    try {
      const query = `
        SELECT 
          PAYMENT_METHOD_ID,
          PAYMENT_METHOD_NAME,
          PAYMENT_METHOD_CODE,
          CURRENCY_CODE,
          ORGANIZATION_CODE,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE
        FROM APPS.XTD_AP_PAYMENT_METHODS_V
        WHERE PAYMENT_METHOD_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      
      if (!result.rows.length) {
        throw new Error(`Payment method with ID ${id} not found`);
      }
      
      this.logger.log(`Found payment method with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching payment method with ID ${id}:`, error);
      throw error;
    }
  }

  async countPaymentMethods(queryDto: PaymentMethodQueryDto = {}): Promise<number> {
    try {
      const { 
        paymentMethodName, 
        paymentMethodCode, 
        currencyCode, 
        organizationCode 
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_AP_PAYMENT_METHODS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (paymentMethodName) {
        query += ` AND UPPER(PAYMENT_METHOD_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${paymentMethodName}%`);
        paramIndex++;
      }

      if (paymentMethodCode) {
        query += ` AND UPPER(PAYMENT_METHOD_CODE) = UPPER(:${paramIndex})`;
        params.push(paymentMethodCode);
        paramIndex++;
      }

      if (currencyCode) {
        query += ` AND UPPER(CURRENCY_CODE) = UPPER(:${paramIndex})`;
        params.push(currencyCode);
        paramIndex++;
      }

      if (organizationCode) {
        query += ` AND UPPER(ORGANIZATION_CODE) = UPPER(:${paramIndex})`;
        params.push(organizationCode);
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
