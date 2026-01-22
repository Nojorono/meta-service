import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class SalesOrderDto {
  @ApiProperty({ description: 'Type of Sales Order', example: 'Standard' })
  @IsString()
  @IsOptional()
  SO_TYPE: string;

  @ApiProperty({ description: 'Sales Order Header ID', example: 12345 })
  HEADER_ID: number;
  @ApiProperty()
  ORG_ID: number;
  @ApiProperty()
  ORG_NAME: string;
  @ApiProperty()
  STATUS: string;
  @ApiProperty()
  ORGANIZATION_ID: number;
  @ApiProperty()
  TRANSACTION_TYPE: string;
  @ApiProperty()
  ORDER_NUMBER: string;
  @ApiProperty()
  ORGANIZATION_ID_FROM: number;
  @ApiProperty()
  SUBINVENTORY_FROM: string;
  @ApiProperty()
  ORDERED_DATE: string;
  @ApiProperty()
  ORGANIZATION_ID_TO: number;
  @ApiProperty()
  SUBINVENTORY_TO: string;
  @ApiProperty()
  LOCATION_BILL: string;
  @ApiProperty()
  LOCATON_SHIP: string;
  @ApiProperty()
  INVOICE_TO_ADDRESS1: string;
  @ApiProperty()
  CREATED_BY: number;
  @ApiProperty()
  CREATED_DATE: string;
  @ApiProperty()
  INVENTORY_ITEM_ID: number;
  @ApiProperty()
  ITEM_CODE: string;
  @ApiProperty()
  ITEM_NUMBER: string;
  @ApiProperty()
  ITEM_DESC: string;
  @ApiProperty()
  ORDERED_QUANTITY: number;
  @ApiProperty()
  ORDER_QUANTITY_UOM: string;
  @ApiPropertyOptional() SHIPPING_QUANTITY?: number;
  @ApiPropertyOptional() SHIPPING_QUANTITY_UOM?: string;
}

export class SalesOrderQueryDto {
  @ApiPropertyOptional({
    description: 'Order number',
    example: '2510121000141',
  })
  @IsOptional()
  @IsString()
  @Type(() => String)
  order_number?: string;

  @ApiPropertyOptional({ description: 'Page number', type: Number, example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({
    description: 'Items per page',
    type: Number,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
