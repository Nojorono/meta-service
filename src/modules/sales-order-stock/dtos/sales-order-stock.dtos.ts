import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SalesOrderStockDto {
  @ApiProperty({ description: 'Header ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  HEADER_ID?: number;

  @ApiProperty({ description: 'Line ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  LINE_ID?: number;

  @ApiProperty({ description: 'Order number', example: 'SO001' })
  @IsOptional()
  @IsString()
  ORDER_NUMBER?: string;

  @ApiProperty({ description: 'Line number', example: 1 })
  @IsOptional()
  @IsNumber()
  LINE_NUMBER?: number;

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

  @ApiProperty({ description: 'Ordered quantity', example: 10 })
  @IsOptional()
  @IsNumber()
  ORDERED_QUANTITY?: number;

  @ApiProperty({ description: 'Shipped quantity', example: 5 })
  @IsOptional()
  @IsNumber()
  SHIPPED_QUANTITY?: number;

  @ApiProperty({ description: 'Cancelled quantity', example: 0 })
  @IsOptional()
  @IsNumber()
  CANCELLED_QUANTITY?: number;

  @ApiProperty({ description: 'Fulfilled quantity', example: 5 })
  @IsOptional()
  @IsNumber()
  FULFILLED_QUANTITY?: number;

  @ApiProperty({ description: 'Invoiced quantity', example: 5 })
  @IsOptional()
  @IsNumber()
  INVOICED_QUANTITY?: number;

  @ApiProperty({ description: 'Unit selling price', example: 100000 })
  @IsOptional()
  @IsNumber()
  UNIT_SELLING_PRICE?: number;

  @ApiProperty({ description: 'Unit list price', example: 120000 })
  @IsOptional()
  @IsNumber()
  UNIT_LIST_PRICE?: number;

  @ApiProperty({ description: 'Currency code', example: 'IDR' })
  @IsOptional()
  @IsString()
  CURRENCY_CODE?: string;

  @ApiProperty({ description: 'Flow status code', example: 'BOOKED' })
  @IsOptional()
  @IsString()
  FLOW_STATUS_CODE?: string;

  @ApiProperty({ description: 'Open flag', example: 'Y' })
  @IsOptional()
  @IsString()
  OPEN_FLAG?: string;

  @ApiProperty({ description: 'Booked flag', example: 'Y' })
  @IsOptional()
  @IsString()
  BOOKED_FLAG?: string;

  @ApiProperty({ description: 'Cancelled flag', example: 'N' })
  @IsOptional()
  @IsString()
  CANCELLED_FLAG?: string;

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

  @ApiProperty({ description: 'Ordered date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ORDERED_DATE?: Date;

  @ApiProperty({ description: 'Request date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  REQUEST_DATE?: Date;

  @ApiProperty({ description: 'Promise date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  PROMISE_DATE?: Date;

  @ApiProperty({ description: 'Schedule ship date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  SCHEDULE_SHIP_DATE?: Date;

  @ApiProperty({ description: 'Actual ship date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  ACTUAL_SHIP_DATE?: Date;

  @ApiProperty({ description: 'Ship from org ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  SHIP_FROM_ORG_ID?: number;

  @ApiProperty({ description: 'Ship from org code', example: 'ORG001' })
  @IsOptional()
  @IsString()
  SHIP_FROM_ORG_CODE?: string;

  @ApiProperty({
    description: 'Ship from org name',
    example: 'Organization Name',
  })
  @IsOptional()
  @IsString()
  SHIP_FROM_ORG_NAME?: string;

  @ApiProperty({ description: 'Subinventory', example: 'STORE' })
  @IsOptional()
  @IsString()
  SUBINVENTORY?: string;

  @ApiProperty({ description: 'UOM code', example: 'PCS' })
  @IsOptional()
  @IsString()
  UOM_CODE?: string;

  @ApiProperty({ description: 'Line type ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  LINE_TYPE_ID?: number;

  @ApiProperty({ description: 'Item type code', example: 'STANDARD' })
  @IsOptional()
  @IsString()
  ITEM_TYPE_CODE?: string;

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

export class SalesOrderStockQueryDto {
  @ApiProperty({ description: 'Header ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  HEADER_ID?: number;

  @ApiProperty({ description: 'Order number', required: false })
  @IsOptional()
  @IsString()
  ORDER_NUMBER?: string;

  @ApiProperty({ description: 'Inventory item ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  INVENTORY_ITEM_ID?: number;

  @ApiProperty({ description: 'Item code', required: false })
  @IsOptional()
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({ description: 'Customer ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  CUSTOMER_ID?: number;

  @ApiProperty({ description: 'Customer number', required: false })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER?: string;

  @ApiProperty({ description: 'Flow status code', required: false })
  @IsOptional()
  @IsString()
  FLOW_STATUS_CODE?: string;

  @ApiProperty({ description: 'Open flag', required: false })
  @IsOptional()
  @IsString()
  OPEN_FLAG?: string;

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
