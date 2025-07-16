import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty({
    description: 'Category ID',
    example: 1001,
  })
  CATEGORY_ID: number;

  @ApiProperty({
    description: 'Category code',
    example: 'CAT001',
  })
  CATEGORY_CODE: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
  })
  CATEGORY_NAME: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Electronic products and accessories',
    required: false,
  })
  CATEGORY_DESCRIPTION?: string;

  @ApiProperty({
    description: 'Category enabled flag',
    example: 'Y',
  })
  ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Category start date',
    example: '2020-01-01',
    required: false,
  })
  START_DATE?: string;

  @ApiProperty({
    description: 'Category end date',
    example: '2030-12-31',
    required: false,
  })
  END_DATE?: string;

  @ApiProperty({
    description: 'Parent category ID',
    example: 1000,
    required: false,
  })
  PARENT_CATEGORY_ID?: number;

  @ApiProperty({
    description: 'Category level',
    example: 2,
    required: false,
  })
  CATEGORY_LEVEL?: number;

  @ApiProperty({
    description: 'Category type',
    example: 'PRODUCT',
    required: false,
  })
  CATEGORY_TYPE?: string;
}

export class CategoryQueryDto {
  @ApiProperty({
    description: 'Category code to filter by',
    example: 'CAT001',
    required: false,
  })
  categoryCode?: string;

  @ApiProperty({
    description: 'Category name to filter by',
    example: 'Electronics',
    required: false,
  })
  categoryName?: string;

  @ApiProperty({
    description: 'Category type to filter by',
    example: 'PRODUCT',
    required: false,
  })
  categoryType?: string;

  @ApiProperty({
    description: 'Parent category ID to filter by',
    example: 1000,
    required: false,
  })
  parentCategoryId?: number;

  @ApiProperty({
    description: 'Category level to filter by',
    example: 2,
    required: false,
  })
  categoryLevel?: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  limit?: number;
}
