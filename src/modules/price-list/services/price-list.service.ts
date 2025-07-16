import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { PriceListDto, PriceListQueryDto } from '../dtos/price-list.dtos';

@Injectable()
export class PriceListService {
  private readonly logger = new Logger(PriceListService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllPriceLists(
    queryDto: PriceListQueryDto = {},
  ): Promise<PriceListDto[]> {
    try {
      const { 
        priceName, 
        itemCode, 
        itemDescription, 
        productUomCode, 
        customerNumber,
        page = 1, 
        limit = 10 
      } = queryDto;
      
      let query = `
        SELECT 
          PRICE_NAME,
          ITEM_CODE,
          ITEM_DESCRIPTION,
          PRODUCT_UOM_CODE,
          LIST_PRICE,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          PRICE_LIST_ID,
          PRICE_LIST_LINE_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          SITE_USE_CODE,
          LOCATION,
          CUST_ACCOUNT_ID,
          SITE_USE_ID
        FROM APPS.XTD_QP_PRICE_LIST_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (priceName) {
        query += ` AND UPPER(PRICE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${priceName}%`);
        paramIndex++;
      }

      if (itemCode) {
        query += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemCode}%`);
        paramIndex++;
      }

      if (itemDescription) {
        query += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemDescription}%`);
        paramIndex++;
      }

      if (productUomCode) {
        query += ` AND UPPER(PRODUCT_UOM_CODE) = UPPER(:${paramIndex})`;
        params.push(productUomCode);
        paramIndex++;
      }

      if (customerNumber) {
        query += ` AND UPPER(CUSTOMER_NUMBER) = UPPER(:${paramIndex})`;
        params.push(customerNumber);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY PRICE_LIST_ID OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} price lists`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching price lists:', error);
      throw error;
    }
  }

  async findPriceListById(id: number): Promise<PriceListDto> {
    try {
      const query = `
        SELECT 
          PRICE_NAME,
          ITEM_CODE,
          ITEM_DESCRIPTION,
          PRODUCT_UOM_CODE,
          LIST_PRICE,
          TO_CHAR(START_DATE_ACTIVE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS START_DATE_ACTIVE,
          TO_CHAR(END_DATE_ACTIVE, 'YYYY-MM-DD') AS END_DATE_ACTIVE,
          PRICE_LIST_ID,
          PRICE_LIST_LINE_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          TO_CHAR(LAST_UPDATE_DATE, 'YYYY-MM-DD HH24:MI:SS.FF3') AS LAST_UPDATE_DATE,
          SITE_USE_CODE,
          LOCATION,
          CUST_ACCOUNT_ID,
          SITE_USE_ID
        FROM APPS.XTD_QP_PRICE_LIST_V
        WHERE PRICE_LIST_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);
      
      if (!result.rows.length) {
        throw new Error(`Price list with ID ${id} not found`);
      }
      
      this.logger.log(`Found price list with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(`Error fetching price list with ID ${id}:`, error);
      throw error;
    }
  }

  async countPriceLists(queryDto: PriceListQueryDto = {}): Promise<number> {
    try {
      const { 
        priceName, 
        itemCode, 
        itemDescription, 
        productUomCode, 
        customerNumber 
      } = queryDto;
      
      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_QP_PRICE_LIST_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (priceName) {
        query += ` AND UPPER(PRICE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${priceName}%`);
        paramIndex++;
      }

      if (itemCode) {
        query += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemCode}%`);
        paramIndex++;
      }

      if (itemDescription) {
        query += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemDescription}%`);
        paramIndex++;
      }

      if (productUomCode) {
        query += ` AND UPPER(PRODUCT_UOM_CODE) = UPPER(:${paramIndex})`;
        params.push(productUomCode);
        paramIndex++;
      }

      if (customerNumber) {
        query += ` AND UPPER(CUSTOMER_NUMBER) = UPPER(:${paramIndex})`;
        params.push(customerNumber);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      
      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting price lists:', error);
      throw error;
    }
  }
}
