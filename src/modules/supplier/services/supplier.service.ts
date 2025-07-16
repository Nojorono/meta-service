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
      const { supplierNumber, supplierName, supplierType, city, country, page = 1, limit = 10 } = queryDto;
      
      let query = `
        SELECT 
          SUPPLIER_ID,
          SUPPLIER_NUMBER,
          SUPPLIER_NAME,
          SUPPLIER_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          CONTACT_PERSON,
          PHONE_NUMBER,
          EMAIL,
          ADDRESS,
          CITY,
          COUNTRY,
          TAX_NUMBER
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (supplierNumber) {
        query += ` AND UPPER(SUPPLIER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${supplierNumber}%`);
        paramIndex++;
      }

      if (supplierName) {
        query += ` AND UPPER(SUPPLIER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${supplierName}%`);
        paramIndex++;
      }

      if (supplierType) {
        query += ` AND UPPER(SUPPLIER_TYPE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${supplierType}%`);
        paramIndex++;
      }

      if (city) {
        query += ` AND UPPER(CITY) LIKE UPPER(:${paramIndex})`;
        params.push(`%${city}%`);
        paramIndex++;
      }

      if (country) {
        query += ` AND UPPER(COUNTRY) LIKE UPPER(:${paramIndex})`;
        params.push(`%${country}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY SUPPLIER_NUMBER OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
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
          SUPPLIER_ID,
          SUPPLIER_NUMBER,
          SUPPLIER_NAME,
          SUPPLIER_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          CONTACT_PERSON,
          PHONE_NUMBER,
          EMAIL,
          ADDRESS,
          CITY,
          COUNTRY,
          TAX_NUMBER
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE SUPPLIER_ID = :1
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

  async findSupplierByNumber(supplierNumber: string): Promise<SupplierDto | null> {
    try {
      const query = `
        SELECT 
          SUPPLIER_ID,
          SUPPLIER_NUMBER,
          SUPPLIER_NAME,
          SUPPLIER_TYPE,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          CONTACT_PERSON,
          PHONE_NUMBER,
          EMAIL,
          ADDRESS,
          CITY,
          COUNTRY,
          TAX_NUMBER
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE SUPPLIER_NUMBER = :1
      `;

      const result = await this.oracleService.executeQuery(query, [supplierNumber]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Supplier not found for number: ${supplierNumber}`);
        return null;
      }

      this.logger.log(`Found supplier: ${supplierNumber}`);
      return result.rows[0] as SupplierDto;
    } catch (error) {
      this.logger.error(`Error finding supplier by number ${supplierNumber}:`, error);
      throw error;
    }
  }

  async getSupplierCount(queryDto: SupplierQueryDto = {}): Promise<number> {
    try {
      const { supplierNumber, supplierName, supplierType, city, country } = queryDto;
      
      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_AP_SUPPLIERS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (supplierNumber) {
        query += ` AND UPPER(SUPPLIER_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${supplierNumber}%`);
        paramIndex++;
      }

      if (supplierName) {
        query += ` AND UPPER(SUPPLIER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${supplierName}%`);
        paramIndex++;
      }

      if (supplierType) {
        query += ` AND UPPER(SUPPLIER_TYPE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${supplierType}%`);
        paramIndex++;
      }

      if (city) {
        query += ` AND UPPER(CITY) LIKE UPPER(:${paramIndex})`;
        params.push(`%${city}%`);
        paramIndex++;
      }

      if (country) {
        query += ` AND UPPER(COUNTRY) LIKE UPPER(:${paramIndex})`;
        params.push(`%${country}%`);
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
