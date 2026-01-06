import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  SalesItemConversionDto,
  SalesItemConversionQueryDto,
} from '../dtos/sales-item-conversion.dtos';

@Injectable()
export class SalesItemConversionService {
  private readonly logger = new Logger(SalesItemConversionService.name);

  constructor(private readonly oracleService: OracleService) { }

  async findAllSalesItemConversions(
    queryDto: SalesItemConversionQueryDto = {},
  ): Promise<SalesItemConversionDto[]> {
    try {
      const {
        itemCode,
        itemNumber,
        itemDescription,
        sourceUomCode,
        baseUomCode,
        page = 1,
        limit = 10,
      } = queryDto;

      // Log input parameters for debugging
      this.logger.log(`Query parameters: ${JSON.stringify(queryDto)}`);

      let query = `
        SELECT 
          ITEM_CODE,
          ITEM_NUMBER,
          ITEM_DESCRIPTION,
          INVENTORY_ITEM_ID,
          SOURCE_UOM_CODE,
          SOURCE_UOM,
          BASE_UOM_CODE,
          BASE_UOM,
          CONVERSION_RATE,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_INV_SALES_ITEM_CONVERSIONS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (itemCode) {
        query += ` AND UPPER(ITEM_CODE) = UPPER(:${paramIndex})`;
        params.push(itemCode);
        paramIndex++;
        this.logger.log(`Added itemCode filter: ${itemCode}`);
      }

      if (itemNumber) {
        query += ` AND UPPER(ITEM_NUMBER) = UPPER(:${paramIndex})`;
        params.push(itemNumber);
        paramIndex++;
        this.logger.log(`Added itemNumber filter: ${itemNumber}`);
      }

      if (itemDescription) {
        query += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemDescription}%`);
        paramIndex++;
        this.logger.log(`Added itemDescription filter: ${itemDescription}`);
      }

      if (sourceUomCode) {
        query += ` AND UPPER(SOURCE_UOM_CODE) = UPPER(:${paramIndex})`;
        params.push(sourceUomCode);
        paramIndex++;
        this.logger.log(`Added sourceUomCode filter: ${sourceUomCode}`);
      }

      if (baseUomCode) {
        query += ` AND UPPER(BASE_UOM_CODE) = UPPER(:${paramIndex})`;
        params.push(baseUomCode);
        paramIndex++;
        this.logger.log(`Added baseUomCode filter: ${baseUomCode}`);
      }

      // Add pagination - Use literal values for better Oracle compatibility
      // Oracle sometimes has issues with bind variables in OFFSET/FETCH
      const offset = (page - 1) * limit;

      if (offset > 0) {
        query += ` ORDER BY ITEM_CODE OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`;
      } else {
        query += ` ORDER BY ITEM_CODE FETCH NEXT ${limit} ROWS ONLY`;
      }

      this.logger.log(`Pagination: page=${page}, limit=${limit}, offset=${offset}`);

      this.logger.log(`Final query: ${query}`);
      this.logger.log(`Query parameters: ${JSON.stringify(params)}`);

      // Debug: Check data without pagination first
      if (itemCode || sourceUomCode || baseUomCode) {
        let debugQuery = query
          .replace(/ORDER BY ITEM_CODE OFFSET \d+ ROWS FETCH NEXT \d+ ROWS ONLY/, 'ORDER BY ITEM_CODE')
          .replace(/ORDER BY ITEM_CODE FETCH NEXT \d+ ROWS ONLY/, 'ORDER BY ITEM_CODE');

        // No need to remove pagination params since we're using literal values now
        const debugParams = params;

        try {
          const debugResult = await this.oracleService.executeQuery(
            debugQuery,
            debugParams,
          );
          this.logger.log(
            `Debug query (without pagination) found ${debugResult.rows.length} rows`,
          );
          if (debugResult.rows.length > 0) {
            this.logger.log(
              `First row sample: ${JSON.stringify(debugResult.rows[0])}`,
            );
          } else {
            this.logger.warn(`Debug query found 0 rows - checking if filters are too strict`);
          }
        } catch (debugError) {
          this.logger.warn(`Debug query failed: ${debugError.message}`);
        }
      }

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} sales item conversions`);
      return result.rows;
    } catch (error) {
      this.logger.error('Error fetching sales item conversions:', error);
      throw error;
    }
  }

  async findSalesItemConversionById(
    id: number,
  ): Promise<SalesItemConversionDto> {
    try {
      const query = `
        SELECT 
          ITEM_CODE,
          ITEM_NUMBER,
          ITEM_DESCRIPTION,
          INVENTORY_ITEM_ID,
          SOURCE_UOM_CODE,
          SOURCE_UOM,
          BASE_UOM_CODE,
          BASE_UOM,
          CONVERSION_RATE,
          START_DATE_ACTIVE,
          END_DATE_ACTIVE,
          LAST_UPDATE_DATE
        FROM APPS.XTD_INV_SALES_ITEM_CONVERSIONS_V
        WHERE INVENTORY_ITEM_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [id]);

      this.logger.log(`Found sales item conversion with ID: ${id}`);
      return result.rows[0];
    } catch (error) {
      this.logger.error(
        `Error fetching sales item conversion with ID ${id}:`,
        error,
      );
      throw error;
    }
  }

  async countSalesItemConversions(
    queryDto: SalesItemConversionQueryDto = {},
  ): Promise<number> {
    try {
      const {
        itemCode,
        itemNumber,
        itemDescription,
        sourceUomCode,
        baseUomCode,
      } = queryDto;

      let query = `
        SELECT COUNT(*) AS TOTAL
        FROM APPS.XTD_INV_SALES_ITEM_CONVERSIONS_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (itemCode) {
        query += ` AND UPPER(ITEM_CODE) = UPPER(:${paramIndex})`;
        params.push(itemCode);
        paramIndex++;
      }

      if (itemNumber) {
        query += ` AND UPPER(ITEM_NUMBER) = UPPER(:${paramIndex})`;
        params.push(itemNumber);
        paramIndex++;
      }

      if (itemDescription) {
        query += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemDescription}%`);
        paramIndex++;
      }

      if (sourceUomCode) {
        query += ` AND UPPER(SOURCE_UOM_CODE) = UPPER(:${paramIndex})`;
        params.push(sourceUomCode);
        paramIndex++;
      }

      if (baseUomCode) {
        query += ` AND UPPER(BASE_UOM_CODE) = UPPER(:${paramIndex})`;
        params.push(baseUomCode);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);

      return result.rows[0].TOTAL;
    } catch (error) {
      this.logger.error('Error counting sales item conversions:', error);
      throw error;
    }
  }
}
