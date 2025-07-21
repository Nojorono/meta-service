import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MtlTrxListsDto {
  @ApiProperty({ description: 'Transaction ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TRANSACTION_ID?: number;

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

  @ApiProperty({ description: 'Transaction type ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TRANSACTION_TYPE_ID?: number;

  @ApiProperty({
    description: 'Transaction type name',
    example: 'Material Issue',
  })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({ description: 'Transaction action ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TRANSACTION_ACTION_ID?: number;

  @ApiProperty({ description: 'Transaction source type ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TRANSACTION_SOURCE_TYPE_ID?: number;

  @ApiProperty({
    description: 'Transaction source name',
    example: 'Sales Order',
  })
  @IsOptional()
  @IsString()
  TRANSACTION_SOURCE_NAME?: string;

  @ApiProperty({ description: 'Transaction quantity', example: 10 })
  @IsOptional()
  @IsNumber()
  TRANSACTION_QUANTITY?: number;

  @ApiProperty({ description: 'Transaction UOM', example: 'PCS' })
  @IsOptional()
  @IsString()
  TRANSACTION_UOM?: string;

  @ApiProperty({ description: 'Primary quantity', example: 10 })
  @IsOptional()
  @IsNumber()
  PRIMARY_QUANTITY?: number;

  @ApiProperty({ description: 'Transaction date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  TRANSACTION_DATE?: Date;

  @ApiProperty({ description: 'Subinventory code', example: 'STORE' })
  @IsOptional()
  @IsString()
  SUBINVENTORY_CODE?: string;

  @ApiProperty({ description: 'Locator ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  LOCATOR_ID?: number;

  @ApiProperty({ description: 'Locator segments', example: 'A.01.01' })
  @IsOptional()
  @IsString()
  LOCATOR_SEGMENTS?: string;

  @ApiProperty({ description: 'Lot number', example: 'LOT001' })
  @IsOptional()
  @IsString()
  LOT_NUMBER?: string;

  @ApiProperty({ description: 'Serial number', example: 'SN001' })
  @IsOptional()
  @IsString()
  SERIAL_NUMBER?: string;

  @ApiProperty({ description: 'Revision', example: 'A' })
  @IsOptional()
  @IsString()
  REVISION?: string;

  @ApiProperty({ description: 'Transfer organization ID', example: 1002 })
  @IsOptional()
  @IsNumber()
  TRANSFER_ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Transfer subinventory', example: 'STORE2' })
  @IsOptional()
  @IsString()
  TRANSFER_SUBINVENTORY?: string;

  @ApiProperty({ description: 'Transfer locator ID', example: 1002 })
  @IsOptional()
  @IsNumber()
  TRANSFER_LOCATOR_ID?: number;

  @ApiProperty({ description: 'Transfer locator segments', example: 'B.01.01' })
  @IsOptional()
  @IsString()
  TRANSFER_LOCATOR_SEGMENTS?: string;

  @ApiProperty({ description: 'Source code', example: 'MANUAL' })
  @IsOptional()
  @IsString()
  SOURCE_CODE?: string;

  @ApiProperty({ description: 'Source line ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  SOURCE_LINE_ID?: number;

  @ApiProperty({ description: 'Source header ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  SOURCE_HEADER_ID?: number;

  @ApiProperty({ description: 'Distribution account ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  DISTRIBUTION_ACCOUNT_ID?: number;

  @ApiProperty({ description: 'Actual cost', example: 100000 })
  @IsOptional()
  @IsNumber()
  ACTUAL_COST?: number;

  @ApiProperty({ description: 'Transaction cost', example: 100000 })
  @IsOptional()
  @IsNumber()
  TRANSACTION_COST?: number;

  @ApiProperty({ description: 'Transaction reference', example: 'REF001' })
  @IsOptional()
  @IsString()
  TRANSACTION_REFERENCE?: string;

  @ApiProperty({ description: 'Reason ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  REASON_ID?: number;

  @ApiProperty({ description: 'Reason name', example: 'Material Issue' })
  @IsOptional()
  @IsString()
  REASON_NAME?: string;

  @ApiProperty({ description: 'Created by', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  CREATED_BY?: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2023-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  CREATION_DATE?: Date;

  @ApiProperty({ description: 'Last updated by', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  LAST_UPDATED_BY?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2023-01-01T00:00:00Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  LAST_UPDATE_DATE?: Date;

  @ApiProperty({ description: 'Last update login', example: 12345 })
  @IsOptional()
  @IsNumber()
  LAST_UPDATE_LOGIN?: number;
}

export class MtlTrxListsQueryDto {
  @ApiProperty({ description: 'Transaction ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TRANSACTION_ID?: number;

  @ApiProperty({ description: 'Organization ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Organization code', required: false })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({ description: 'Inventory item ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  INVENTORY_ITEM_ID?: number;

  @ApiProperty({ description: 'Item code', required: false })
  @IsOptional()
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({ description: 'Transaction type ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TRANSACTION_TYPE_ID?: number;

  @ApiProperty({ description: 'Transaction type name', required: false })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({ description: 'Subinventory code', required: false })
  @IsOptional()
  @IsString()
  SUBINVENTORY_CODE?: string;

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
