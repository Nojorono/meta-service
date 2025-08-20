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
        PRICE_NAME,
        ITEM_CODE,
        CUSTOMER_NAME,
        CUSTOMER_NUMBER,
        LOCATION,
        page = 1,
        limit = 50,
      } = queryDto;

      let query = `
        SELECT 
          PRICE_NAME,
          ITEM_CODE,
          ITEM_DESCRIPTION,
          PRODUCT_UOM_CODE,
          LIST_PRICE,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          PRICE_LIST_ID,
          PRICE_LIST_LINE_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          LAST_UPDATE_DATE,
          SITE_USE_CODE,
          LOCATION,
          CUST_ACCOUNT_ID,
          SITE_USE_ID
        FROM XTD_ONT_PRICE_LISTS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (PRICE_NAME) {
        query += ` AND UPPER(PRICE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${PRICE_NAME}%`);
        paramIndex++;
      }

      if (ITEM_CODE) {
        query += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${ITEM_CODE}%`);
        paramIndex++;
      }

      if (CUSTOMER_NAME) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NAME}%`);
        paramIndex++;
      }

      if (CUSTOMER_NUMBER) {
        query += ` AND UPPER(CUSTOMER_NUMBER) = UPPER(:${paramIndex})`;
        params.push(CUSTOMER_NUMBER);
        paramIndex++;
      }

      if (LOCATION) {
        query += ` AND UPPER(LOCATION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${LOCATION}%`);
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

  async findPriceListById(
    priceListId: number,
    priceListLineId: number,
  ): Promise<PriceListDto | null> {
    try {
      const query = `
        SELECT 
          PRICE_NAME,
          ITEM_CODE,
          ITEM_DESCRIPTION,
          PRODUCT_UOM_CODE,
          LIST_PRICE,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          PRICE_LIST_ID,
          PRICE_LIST_LINE_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          LAST_UPDATE_DATE,
          SITE_USE_CODE,
          LOCATION,
          CUST_ACCOUNT_ID,
          SITE_USE_ID
        FROM XTD_ONT_PRICE_LISTS_V
        WHERE PRICE_LIST_ID = :1 AND PRICE_LIST_LINE_ID = :2
      `;

      const result = await this.oracleService.executeQuery(query, [
        priceListId,
        priceListLineId,
      ]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      this.logger.error('Error fetching price list item:', error);
      throw error;
    }
  }

  async findByPriceListId(priceListId: number): Promise<PriceListDto[]> {
    try {
      const query = `
        SELECT 
          PRICE_NAME,
          ITEM_CODE,
          ITEM_DESCRIPTION,
          PRODUCT_UOM_CODE,
          LIST_PRICE,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          PRICE_LIST_ID,
          PRICE_LIST_LINE_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          LAST_UPDATE_DATE,
          SITE_USE_CODE,
          LOCATION,
          CUST_ACCOUNT_ID,
          SITE_USE_ID
        FROM XTD_ONT_PRICE_LISTS_V
        WHERE PRICE_LIST_ID = :1
        ORDER BY ITEM_CODE
      `;

      const result = await this.oracleService.executeQuery(query, [
        priceListId,
      ]);
      return result.rows;
    } catch (error) {
      this.logger.error(
        'Error fetching price list items by price list ID:',
        error,
      );
      throw error;
    }
  }

  async countPriceLists(queryDto: PriceListQueryDto = {}): Promise<number> {
    try {
      const {
        PRICE_NAME,
        ITEM_CODE,
        CUSTOMER_NAME,
        CUSTOMER_NUMBER,
        LOCATION,
      } = queryDto;

      let query = `
        SELECT COUNT(*) as TOTAL
        FROM XTD_ONT_PRICE_LISTS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (PRICE_NAME) {
        query += ` AND UPPER(PRICE_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${PRICE_NAME}%`);
        paramIndex++;
      }

      if (ITEM_CODE) {
        query += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${ITEM_CODE}%`);
        paramIndex++;
      }

      if (CUSTOMER_NAME) {
        query += ` AND UPPER(CUSTOMER_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${CUSTOMER_NAME}%`);
        paramIndex++;
      }

      if (CUSTOMER_NUMBER) {
        query += ` AND UPPER(CUSTOMER_NUMBER) = UPPER(:${paramIndex})`;
        params.push(CUSTOMER_NUMBER);
        paramIndex++;
      }

      if (LOCATION) {
        query += ` AND UPPER(LOCATION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${LOCATION}%`);
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
