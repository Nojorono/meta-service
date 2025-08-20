import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SalesOrderStockDto {
  @ApiProperty({ description: 'FPPR Number', example: 'FPPR123456' })
  @IsOptional()
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'Item Code', example: 12345 })
  @IsOptional()
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({ description: 'Item Number', example: 'ITEM123' })
  @IsOptional()
  @IsString()
  ITEM_NUMBER?: string;

  @ApiProperty({
    description: 'Item Description',
    example: 'Description of the item',
  })
  @IsOptional()
  @IsString()
  ITEM_DESCRIPTION?: string;

  @ApiProperty({ description: 'Organization ID', example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Organization Code', example: 'ORG123' })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({ description: 'Item', example: 'ITEM123' })
  @IsOptional()
  @IsString()
  ITEM?: string;

  @ApiProperty({ description: 'Subinventory', example: 'SUBINV123' })
  @IsOptional()
  @IsString()
  SUBINVENTORY?: string;

  @ApiProperty({ description: 'Locator', example: 'LOC123' })
  @IsOptional()
  @IsString()
  LOCATOR?: string;

  @ApiProperty({ description: 'Unit of Measure', example: 'EA' })
  @IsOptional()
  @IsString()
  UOM?: string;

  @ApiProperty({ description: 'Quantity', example: 100 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  QUANTITY?: number;
}

export class SalesOrderStockQueryDto {
  @ApiProperty({ description: 'FPPR Number', required: false })
  @IsOptional()
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'Item Code', required: false })
  @IsOptional()
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({ description: 'Item Number', required: false })
  @IsOptional()
  @IsString()
  ITEM_NUMBER?: string;

  @ApiProperty({ description: 'Item Description', required: false })
  @IsOptional()
  @IsString()
  ITEM_DESCRIPTION?: string;

  @ApiProperty({ description: 'Organization ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Organization Code', required: false })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({ description: 'Item', required: false })
  @IsOptional()
  @IsString()
  ITEM?: string;

  @ApiProperty({ description: 'Subinventory', required: false })
  @IsOptional()
  @IsString()
  SUBINVENTORY?: string;

  @ApiProperty({ description: 'Locator', required: false })
  @IsOptional()
  @IsString()
  LOCATOR?: string;

  @ApiProperty({ description: 'Unit of Measure', required: false })
  @IsOptional()
  @IsString()
  UOM?: string;

  @ApiProperty({ description: 'Quantity', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  QUANTITY?: number;

  @ApiProperty({ description: 'Page number', required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
