import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { CategoryDto, CategoryQueryDto } from '../dtos/category.dtos';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllCategories(
    queryDto: CategoryQueryDto = {},
  ): Promise<CategoryDto[]> {
    try {
      const { categoryCode, categoryName, categoryType, parentCategoryId, categoryLevel, page = 1, limit = 10 } = queryDto;
      
      let query = `
        SELECT 
          CATEGORY_ID,
          CATEGORY_CODE,
          CATEGORY_NAME,
          CATEGORY_DESCRIPTION,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          PARENT_CATEGORY_ID,
          CATEGORY_LEVEL,
          CATEGORY_TYPE
        FROM APPS.XTD_INV_CATEGORIES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (categoryCode) {
        query += ` AND UPPER(CATEGORY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${categoryCode}%`);
        paramIndex++;
      }

      if (categoryName) {
        query += ` AND UPPER(CATEGORY_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${categoryName}%`);
        paramIndex++;
      }

      if (categoryType) {
        query += ` AND UPPER(CATEGORY_TYPE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${categoryType}%`);
        paramIndex++;
      }

      if (parentCategoryId) {
        query += ` AND PARENT_CATEGORY_ID = :${paramIndex}`;
        params.push(parentCategoryId);
        paramIndex++;
      }

      if (categoryLevel) {
        query += ` AND CATEGORY_LEVEL = :${paramIndex}`;
        params.push(categoryLevel);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY CATEGORY_CODE OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);
      
      this.logger.log(`Found ${result.rows.length} categories`);
      return result.rows as CategoryDto[];
    } catch (error) {
      this.logger.error('Error finding categories:', error);
      throw error;
    }
  }

  async findCategoryById(categoryId: number): Promise<CategoryDto | null> {
    try {
      const query = `
        SELECT 
          CATEGORY_ID,
          CATEGORY_CODE,
          CATEGORY_NAME,
          CATEGORY_DESCRIPTION,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          PARENT_CATEGORY_ID,
          CATEGORY_LEVEL,
          CATEGORY_TYPE
        FROM APPS.XTD_INV_CATEGORIES_V
        WHERE CATEGORY_ID = :1
      `;

      const result = await this.oracleService.executeQuery(query, [categoryId]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Category not found for ID: ${categoryId}`);
        return null;
      }

      this.logger.log(`Found category: ${categoryId}`);
      return result.rows[0] as CategoryDto;
    } catch (error) {
      this.logger.error(`Error finding category by ID ${categoryId}:`, error);
      throw error;
    }
  }

  async findCategoryByCode(categoryCode: string): Promise<CategoryDto | null> {
    try {
      const query = `
        SELECT 
          CATEGORY_ID,
          CATEGORY_CODE,
          CATEGORY_NAME,
          CATEGORY_DESCRIPTION,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          PARENT_CATEGORY_ID,
          CATEGORY_LEVEL,
          CATEGORY_TYPE
        FROM APPS.XTD_INV_CATEGORIES_V
        WHERE CATEGORY_CODE = :1
      `;

      const result = await this.oracleService.executeQuery(query, [categoryCode]);
      
      if (result.rows.length === 0) {
        this.logger.warn(`Category not found for code: ${categoryCode}`);
        return null;
      }

      this.logger.log(`Found category: ${categoryCode}`);
      return result.rows[0] as CategoryDto;
    } catch (error) {
      this.logger.error(`Error finding category by code ${categoryCode}:`, error);
      throw error;
    }
  }

  async findCategoriesByParentId(parentCategoryId: number): Promise<CategoryDto[]> {
    try {
      const query = `
        SELECT 
          CATEGORY_ID,
          CATEGORY_CODE,
          CATEGORY_NAME,
          CATEGORY_DESCRIPTION,
          ENABLED_FLAG,
          TO_CHAR(START_DATE, 'YYYY-MM-DD') AS START_DATE,
          TO_CHAR(END_DATE, 'YYYY-MM-DD') AS END_DATE,
          PARENT_CATEGORY_ID,
          CATEGORY_LEVEL,
          CATEGORY_TYPE
        FROM APPS.XTD_INV_CATEGORIES_V
        WHERE PARENT_CATEGORY_ID = :1
        ORDER BY CATEGORY_CODE
      `;

      const result = await this.oracleService.executeQuery(query, [parentCategoryId]);
      
      this.logger.log(`Found ${result.rows.length} categories for parent: ${parentCategoryId}`);
      return result.rows as CategoryDto[];
    } catch (error) {
      this.logger.error(`Error finding categories by parent ID ${parentCategoryId}:`, error);
      throw error;
    }
  }

  async getCategoryCount(queryDto: CategoryQueryDto = {}): Promise<number> {
    try {
      const { categoryCode, categoryName, categoryType, parentCategoryId, categoryLevel } = queryDto;
      
      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM APPS.XTD_INV_CATEGORIES_V
        WHERE 1=1
      `;

      const params: any[] = [];
      let paramIndex = 1;

      if (categoryCode) {
        query += ` AND UPPER(CATEGORY_CODE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${categoryCode}%`);
        paramIndex++;
      }

      if (categoryName) {
        query += ` AND UPPER(CATEGORY_NAME) LIKE UPPER(:${paramIndex})`;
        params.push(`%${categoryName}%`);
        paramIndex++;
      }

      if (categoryType) {
        query += ` AND UPPER(CATEGORY_TYPE) LIKE UPPER(:${paramIndex})`;
        params.push(`%${categoryType}%`);
        paramIndex++;
      }

      if (parentCategoryId) {
        query += ` AND PARENT_CATEGORY_ID = :${paramIndex}`;
        params.push(parentCategoryId);
        paramIndex++;
      }

      if (categoryLevel) {
        query += ` AND CATEGORY_LEVEL = :${paramIndex}`;
        params.push(categoryLevel);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;
      
      this.logger.log(`Total categories count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting category count:', error);
      throw error;
    }
  }
}
