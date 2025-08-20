import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceListDto {
  @ApiProperty({
    description: 'Price name',
    example: 'PL - RRO Nasional / SPO',
  })
  PRICE_NAME: string;

  @ApiProperty({
    description: 'Item code',
    example: 'ABC12',
  })
  ITEM_CODE: string;

  @ApiProperty({
    description: 'Item description',
    example: 'AROMA BOLD COFFEE 12',
  })
  ITEM_DESCRIPTION: string;

  @ApiProperty({
    description: 'Product UOM code',
    example: 'BAL',
  })
  PRODUCT_UOM_CODE: string;

  @ApiProperty({
    description: 'List price',
    example: 1650000,
  })
  @Type(() => Number)
  LIST_PRICE: number;

  @ApiProperty({
    description: 'Start date active',
    example: '2025-04-28 00:00:00.000',
    required: false,
  })
  START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'End date active',
    example: '2025-12-31 23:59:59.000',
    required: false,
  })
  END_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Price list ID',
    example: 7010,
  })
  @Type(() => Number)
  PRICE_LIST_ID: number;

  @ApiProperty({
    description: 'Price list line ID',
    example: 128016,
  })
  @Type(() => Number)
  PRICE_LIST_LINE_ID: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'PT. EXAMPLE COMPANY',
    required: false,
  })
  CUSTOMER_NAME?: string;

  @ApiProperty({
    description: 'Customer number',
    example: 'CUST001',
    required: false,
  })
  CUSTOMER_NUMBER?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-06-05 08:01:21.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;

  @ApiProperty({
    description: 'Site use code',
    example: 'BILL_TO',
    required: false,
  })
  SITE_USE_CODE?: string;

  @ApiProperty({
    description: 'Location',
    example: 'Jakarta',
    required: false,
  })
  LOCATION?: string;

  @ApiProperty({
    description: 'Customer account ID',
    example: 12345,
    required: false,
  })
  @Type(() => Number)
  CUST_ACCOUNT_ID?: number;

  @ApiProperty({
    description: 'Site use ID',
    example: 67890,
    required: false,
  })
  @Type(() => Number)
  SITE_USE_ID?: number;
}

export class PriceListQueryDto {
  @ApiProperty({
    description: 'Price name to filter by',
    example: 'PL - RRO Nasional / SPO',
    required: false,
  })
  @IsOptional()
  @IsString()
  PRICE_NAME?: string;

  @ApiProperty({
    description: 'Item code to filter by',
    example: 'ABC12',
    required: false,
  })
  @IsOptional()
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({
    description: 'Customer name to filter by',
    example: 'PT. EXAMPLE COMPANY',
    required: false,
  })
  @IsOptional()
  @IsString()
  CUSTOMER_NAME?: string;

  @ApiProperty({
    description: 'Customer number to filter by',
    example: 'CUST001',
    required: false,
  })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER?: string;

  @ApiProperty({
    description: 'Location to filter by',
    example: 'Jakarta',
    required: false,
  })
  @IsOptional()
  @IsString()
  LOCATION?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
