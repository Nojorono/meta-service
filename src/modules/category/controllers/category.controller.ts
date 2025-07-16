import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { CategoryService } from '../services/category.service';
import { CategoryDto, CategoryQueryDto } from '../dtos/category.dtos';

@ApiTags('Category')
@Controller('category')
@Public()
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);

  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all categories',
    description: 'Retrieve a list of all categories from XTD_INV_CATEGORIES_V view'
  })
  @ApiQuery({
    name: 'categoryCode',
    required: false,
    description: 'Filter by category code',
    example: 'CAT001'
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    description: 'Filter by category name',
    example: 'Electronics'
  })
  @ApiQuery({
    name: 'categoryType',
    required: false,
    description: 'Filter by category type',
    example: 'PRODUCT'
  })
  @ApiQuery({
    name: 'parentCategoryId',
    required: false,
    description: 'Filter by parent category ID',
    example: 1000
  })
  @ApiQuery({
    name: 'categoryLevel',
    required: false,
    description: 'Filter by category level',
    example: 2
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully',
    type: [CategoryDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllCategories(@Query() queryDto: CategoryQueryDto): Promise<CategoryDto[]> {
    try {
      this.logger.log('Fetching all categories with filters:', queryDto);
      return await this.categoryService.findAllCategories(queryDto);
    } catch (error) {
      this.logger.error('Error fetching categories:', error);
      throw new HttpException(
        'Failed to fetch categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Get category count',
    description: 'Get the total count of categories matching the filter criteria'
  })
  @ApiQuery({
    name: 'categoryCode',
    required: false,
    description: 'Filter by category code',
    example: 'CAT001'
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    description: 'Filter by category name',
    example: 'Electronics'
  })
  @ApiQuery({
    name: 'categoryType',
    required: false,
    description: 'Filter by category type',
    example: 'PRODUCT'
  })
  @ApiQuery({
    name: 'parentCategoryId',
    required: false,
    description: 'Filter by parent category ID',
    example: 1000
  })
  @ApiQuery({
    name: 'categoryLevel',
    required: false,
    description: 'Filter by category level',
    example: 2
  })
  @ApiResponse({
    status: 200,
    description: 'Category count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 200 }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCategoryCount(@Query() queryDto: CategoryQueryDto): Promise<{ count: number }> {
    try {
      this.logger.log('Getting category count with filters:', queryDto);
      const count = await this.categoryService.getCategoryCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting category count:', error);
      throw new HttpException(
        'Failed to get category count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('parent/:parentId')
  @ApiOperation({ 
    summary: 'Get categories by parent ID',
    description: 'Retrieve all categories for a specific parent category from XTD_INV_CATEGORIES_V view'
  })
  @ApiParam({
    name: 'parentId',
    description: 'Parent category ID',
    example: 1000,
  })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [CategoryDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findCategoriesByParentId(@Param('parentId', ParseIntPipe) parentId: number): Promise<CategoryDto[]> {
    try {
      this.logger.log(`Fetching categories by parent ID: ${parentId}`);
      return await this.categoryService.findCategoriesByParentId(parentId);
    } catch (error) {
      this.logger.error(`Error fetching categories by parent ID ${parentId}:`, error);
      throw new HttpException(
        'Failed to fetch categories',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('code/:code')
  @ApiOperation({ 
    summary: 'Get category by code',
    description: 'Retrieve a specific category by its code from XTD_INV_CATEGORIES_V view'
  })
  @ApiParam({
    name: 'code',
    description: 'Category code',
    example: 'CAT001',
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findCategoryByCode(@Param('code') code: string): Promise<CategoryDto> {
    try {
      this.logger.log(`Fetching category by code: ${code}`);
      const category = await this.categoryService.findCategoryByCode(code);
      
      if (!category) {
        throw new HttpException(
          `Category with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return category;
    } catch (error) {
      this.logger.error(`Error fetching category by code ${code}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get category by ID',
    description: 'Retrieve a specific category by its ID from XTD_INV_CATEGORIES_V view'
  })
  @ApiParam({
    name: 'id',
    description: 'Category ID',
    example: 1001,
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findCategoryById(@Param('id', ParseIntPipe) id: number): Promise<CategoryDto> {
    try {
      this.logger.log(`Fetching category by ID: ${id}`);
      const category = await this.categoryService.findCategoryById(id);
      
      if (!category) {
        throw new HttpException(
          `Category with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return category;
    } catch (error) {
      this.logger.error(`Error fetching category by ID ${id}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch category',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
