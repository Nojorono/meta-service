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
        query += ` AND UPPER(ITEM_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemCode}%`);
        paramIndex++;
      }

      if (itemNumber) {
        query += ` AND UPPER(ITEM_NUMBER) LIKE UPPER(:${paramIndex})`;
        params.push(`%${itemNumber}%`);
        paramIndex++;
      }

      if (itemDescription) {
        query += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${itemDescription}%`);
        paramIndex++;
      }

      if (sourceUomCode) {
        query += ` AND UPPER(SOURCE_UOM_CODE) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${sourceUomCode}%`);
        paramIndex++;
      }

      if (baseUomCode) {
        query += ` AND UPPER(BASE_UOM_CODE) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${baseUomCode}%`);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY ITEM_CODE OFFSET ':${paramIndex}' ROWS FETCH NEXT ':${paramIndex + 1}' ROWS ONLY`;
      params.push(offset); // :paramIndex
      params.push(limit); // :paramIndex + 1

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
        query += ` AND UPPER(ITEM_CODE) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${itemCode}%`);
        paramIndex++;
      }

      if (itemNumber) {
        query += ` AND UPPER(ITEM_NUMBER) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${itemNumber}%`);
        paramIndex++;
      }

      if (itemDescription) {
        query += ` AND UPPER(ITEM_DESCRIPTION) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${itemDescription}%`);
        paramIndex++;
      }

      if (sourceUomCode) {
        query += ` AND UPPER(SOURCE_UOM_CODE) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${sourceUomCode}%`);
        paramIndex++;
      }

      if (baseUomCode) {
        query += ` AND UPPER(BASE_UOM_CODE) LIKE UPPER(':${paramIndex}')`;
        params.push(`%${baseUomCode}%`);
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
