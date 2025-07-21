import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SummaryFpprDto {
  @ApiProperty({ description: 'Header ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  HEADER_ID?: number;

  @ApiProperty({ description: 'Line ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  LINE_ID?: number;

  @ApiProperty({ description: 'FPPR number', example: 'FPPR001' })
  @IsOptional()
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'FPPR date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  FPPR_DATE?: Date;

  @ApiProperty({ description: 'FPPR type', example: 'CREDIT' })
  @IsOptional()
  @IsString()
  FPPR_TYPE?: string;

  @ApiProperty({ description: 'FPPR sales type', example: 'RETAIL' })
  @IsOptional()
  @IsString()
  FPPR_SALES_TYPE?: string;

  @ApiProperty({ description: 'Customer ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  CUSTOMER_ID?: number;

  @ApiProperty({ description: 'Customer number', example: 'CUST001' })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER?: string;

  @ApiProperty({ description: 'Customer name', example: 'PT. Customer Name' })
  @IsOptional()
  @IsString()
  CUSTOMER_NAME?: string;

  @ApiProperty({ description: 'Salesperson ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  SALESPERSON_ID?: number;

  @ApiProperty({ description: 'Salesperson name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  SALESPERSON_NAME?: string;

  @ApiProperty({ description: 'Inventory item ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  INVENTORY_ITEM_ID?: number;

  @ApiProperty({ description: 'Item code', example: 'ITEM001' })
  @IsOptional()
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({
    description: 'Item description',
    example: 'Product Description',
  })
  @IsOptional()
  @IsString()
  ITEM_DESCRIPTION?: string;

  @ApiProperty({ description: 'Quantity', example: 10 })
  @IsOptional()
  @IsNumber()
  QUANTITY?: number;

  @ApiProperty({ description: 'UOM code', example: 'PCS' })
  @IsOptional()
  @IsString()
  UOM_CODE?: string;

  @ApiProperty({ description: 'Unit price', example: 100000 })
  @IsOptional()
  @IsNumber()
  UNIT_PRICE?: number;

  @ApiProperty({ description: 'Total amount', example: 1000000 })
  @IsOptional()
  @IsNumber()
  TOTAL_AMOUNT?: number;

  @ApiProperty({ description: 'Discount amount', example: 50000 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_AMOUNT?: number;

  @ApiProperty({ description: 'Tax amount', example: 110000 })
  @IsOptional()
  @IsNumber()
  TAX_AMOUNT?: number;

  @ApiProperty({ description: 'Net amount', example: 1060000 })
  @IsOptional()
  @IsNumber()
  NET_AMOUNT?: number;

  @ApiProperty({ description: 'Currency code', example: 'IDR' })
  @IsOptional()
  @IsString()
  CURRENCY_CODE?: string;

  @ApiProperty({ description: 'Exchange rate', example: 1.0 })
  @IsOptional()
  @IsNumber()
  EXCHANGE_RATE?: number;

  @ApiProperty({ description: 'Status', example: 'APPROVED' })
  @IsOptional()
  @IsString()
  STATUS?: string;

  @ApiProperty({ description: 'Approved date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  APPROVED_DATE?: Date;

  @ApiProperty({ description: 'Approved by', example: 'MANAGER' })
  @IsOptional()
  @IsString()
  APPROVED_BY?: string;

  @ApiProperty({ description: 'Organization ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Organization code', example: 'ORG001' })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Organization Name',
  })
  @IsOptional()
  @IsString()
  ORGANIZATION_NAME?: string;

  @ApiProperty({ description: 'Branch ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  BRANCH_ID?: number;

  @ApiProperty({ description: 'Branch code', example: 'BR001' })
  @IsOptional()
  @IsString()
  BRANCH_CODE?: string;

  @ApiProperty({ description: 'Branch name', example: 'Branch Name' })
  @IsOptional()
  @IsString()
  BRANCH_NAME?: string;

  @ApiProperty({ description: 'Reference number', example: 'REF001' })
  @IsOptional()
  @IsString()
  REFERENCE_NUMBER?: string;

  @ApiProperty({ description: 'Request date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  REQUEST_DATE?: Date;

  @ApiProperty({ description: 'Valid until', example: '2023-01-31' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  VALID_UNTIL?: Date;

  @ApiProperty({ description: 'Remarks', example: 'Additional remarks' })
  @IsOptional()
  @IsString()
  REMARKS?: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  CREATION_DATE?: Date;

  @ApiProperty({ description: 'Created by', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  CREATED_BY?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  LAST_UPDATE_DATE?: Date;

  @ApiProperty({ description: 'Last updated by', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  LAST_UPDATED_BY?: string;

  @ApiProperty({ description: 'Last update login', example: 12345 })
  @IsOptional()
  @IsNumber()
  LAST_UPDATE_LOGIN?: number;
}

export class SummaryFpprQueryDto {
  @ApiProperty({ description: 'Header ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  HEADER_ID?: number;

  @ApiProperty({ description: 'FPPR number', required: false })
  @IsOptional()
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'FPPR type', required: false })
  @IsOptional()
  @IsString()
  FPPR_TYPE?: string;

  @ApiProperty({ description: 'FPPR sales type', required: false })
  @IsOptional()
  @IsString()
  FPPR_SALES_TYPE?: string;

  @ApiProperty({ description: 'Customer ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  CUSTOMER_ID?: number;

  @ApiProperty({ description: 'Customer number', required: false })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER?: string;

  @ApiProperty({ description: 'Salesperson ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  SALESPERSON_ID?: number;

  @ApiProperty({ description: 'Status', required: false })
  @IsOptional()
  @IsString()
  STATUS?: string;

  @ApiProperty({ description: 'Organization ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Branch ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  BRANCH_ID?: number;

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
