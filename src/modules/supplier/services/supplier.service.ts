import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { SupplierDto, SupplierQueryDto } from '../dtos/supplier.dtos';

@Injectable()
export class SupplierService {
  private readonly logger = new Logger(SupplierService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllSuppliers(
    queryDto: SupplierQueryDto = {},
  ): Promise<SupplierDto[]> {
    try {
      const {
        VENDOR_ID,
        VENDOR_NAME,
        VENDOR_TYPE_LOOKUP_CODE,
        ENABLED_FLAG,
        VAT_CODE,
        page = 1,
        limit = 10,
      } = queryDto;

      let query = `
        SELECT 
          VENDOR_ID,
          VENDOR_NAME,
          VENDOR_NAME_ALT,
          SUMMARY_FLAG,
          ENABLED_FLAG,
          LAST_UPDATE_LOGIN,
          VENDOR_TYPE_LOOKUP_CODE,
          ONE_TIME_FLAG,
          VAT_CODE,
          TERMS_DATE_BASIS,
          ATTRIBUTE5,
          ATTRIBUTE6,
          ATTRIBUTE7,
          ATTRIBUTE8,
          ATTRIBUTE9,
          ATTRIBUTE10,
          ATTRIBUTE11,
          ATTRIBUTE12,
          ATTRIBUTE13,
          VAT_REGISTRATION_NUM,
          PARTY_ID
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (VENDOR_ID) {
        query += ` AND VENDOR_ID = :${paramIndex}`;
        params.push(VENDOR_ID);
        paramIndex++;
      }

      if (VENDOR_NAME) {
        query += ` AND UPPER(VENDOR_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${VENDOR_NAME}%`);
        paramIndex++;
      }

      if (VENDOR_TYPE_LOOKUP_CODE) {
        query += ` AND UPPER(VENDOR_TYPE_LOOKUP_CODE) = UPPER(:${paramIndex})`;
        params.push(VENDOR_TYPE_LOOKUP_CODE);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      if (VAT_CODE) {
        query += ` AND UPPER(VAT_CODE) = UPPER(:${paramIndex})`;
        params.push(VAT_CODE);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY VENDOR_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} suppliers`);
      return result.rows as SupplierDto[];
    } catch (error) {
      this.logger.error('Error finding suppliers:', error);
      throw error;
    }
  }

  async findSupplierById(supplierId: number): Promise<SupplierDto | null> {
    try {
      const query = `
        SELECT 
          VENDOR_ID,
          VENDOR_NAME,
          VENDOR_NAME_ALT,
          SUMMARY_FLAG,
          ENABLED_FLAG,
          LAST_UPDATE_LOGIN,
          VENDOR_TYPE_LOOKUP_CODE,
          ONE_TIME_FLAG,
          VAT_CODE,
          TERMS_DATE_BASIS,
          ATTRIBUTE5,
          ATTRIBUTE6,
          ATTRIBUTE7,
          ATTRIBUTE8,
          ATTRIBUTE9,
          ATTRIBUTE10,
          ATTRIBUTE11,
          ATTRIBUTE12,
          ATTRIBUTE13,
          VAT_REGISTRATION_NUM,
          PARTY_ID
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE VENDOR_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [supplierId]);

      if (result.rows.length === 0) {
        this.logger.warn(`Supplier not found for ID: ${supplierId}`);
        return null;
      }

      this.logger.log(`Found supplier: ${supplierId}`);
      return result.rows[0] as SupplierDto;
    } catch (error) {
      this.logger.error(`Error finding supplier by ID ${supplierId}:`, error);
      throw error;
    }
  }

  async findSupplierByName(
    vendorName: string,
  ): Promise<SupplierDto | null> {
    try {
      const query = `
        SELECT 
          VENDOR_ID,
          VENDOR_NAME,
          VENDOR_NAME_ALT,
          SUMMARY_FLAG,
          ENABLED_FLAG,
          LAST_UPDATE_LOGIN,
          VENDOR_TYPE_LOOKUP_CODE,
          ONE_TIME_FLAG,
          VAT_CODE,
          TERMS_DATE_BASIS,
          ATTRIBUTE5,
          ATTRIBUTE6,
          ATTRIBUTE7,
          ATTRIBUTE8,
          ATTRIBUTE9,
          ATTRIBUTE10,
          ATTRIBUTE11,
          ATTRIBUTE12,
          ATTRIBUTE13,
          VAT_REGISTRATION_NUM,
          PARTY_ID
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE VENDOR_NAME = :1
      `;

      const result = await this.oracleService.executeQuery(query, [
        vendorName,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(`Supplier not found for name: ${vendorName}`);
        return null;
      }

      this.logger.log(`Found supplier: ${vendorName}`);
      return result.rows[0] as SupplierDto;
    } catch (error) {
      this.logger.error(
        `Error finding supplier by name ${vendorName}:`,
        error,
      );
      throw error;
    }
  }

  async getSupplierCount(queryDto: SupplierQueryDto = {}): Promise<number> {
    try {
      const { VENDOR_ID, VENDOR_NAME, VENDOR_TYPE_LOOKUP_CODE, ENABLED_FLAG, VAT_CODE } =
        queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (VENDOR_ID) {
        query += ` AND VENDOR_ID = :${paramIndex}`;
        params.push(VENDOR_ID);
        paramIndex++;
      }

      if (VENDOR_NAME) {
        query += ` AND UPPER(VENDOR_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${VENDOR_NAME}%`);
        paramIndex++;
      }

      if (VENDOR_TYPE_LOOKUP_CODE) {
        query += ` AND UPPER(VENDOR_TYPE_LOOKUP_CODE) = UPPER(:${paramIndex})`;
        params.push(VENDOR_TYPE_LOOKUP_CODE);
        paramIndex++;
      }

      if (ENABLED_FLAG) {
        query += ` AND UPPER(ENABLED_FLAG) = UPPER(:${paramIndex})`;
        params.push(ENABLED_FLAG);
        paramIndex++;
      }

      if (VAT_CODE) {
        query += ` AND UPPER(VAT_CODE) = UPPER(:${paramIndex})`;
        params.push(VAT_CODE);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;

      this.logger.log(`Total suppliers count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting supplier count:', error);
      throw error;
    }
  }
}
