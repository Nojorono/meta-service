import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MtlTrxListsDto {
  @ApiProperty({ description: 'Transaction type name' })
  @IsString()
  TRANSACTION_TYPE_NAME: string;

  @ApiProperty({ description: 'FPPR number' })
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'Reference number' })
  @IsString()
  REFERENCE_NUMBER?: string;

  @ApiProperty({ description: 'Item code' })
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({ description: 'Item number' })
  @IsString()
  ITEM_NUMBER?: string;

  @ApiProperty({ description: 'Item description' })
  @IsString()
  ITEM_DESCRIPTION?: string;

  @ApiProperty({ description: 'Organization ID' })
  @IsNumber()
  @Type(() => Number)
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Organization code' })
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({ description: 'Item' })
  @IsString()
  ITEM?: string;

  @ApiProperty({ description: 'Subinventory' })
  @IsString()
  SUBINVENTORY?: string;

  @ApiProperty({ description: 'Locator' })
  @IsString()
  LOCATOR?: string;

  @ApiProperty({ description: 'Transaction date' })
  @IsDate()
  @Type(() => Date)
  TRANSACTION_DATE?: Date;

  @ApiProperty({ description: 'Unit of measure' })
  @IsString()
  UOM?: string;

  @ApiProperty({ description: 'Quantity' })
  @IsNumber()
  @Type(() => Number)
  QUANTITY?: number;

  @ApiProperty({ description: 'Transacted by' })
  @IsString()
  TRANSACT_BY?: string;
}

export class MtlTrxListsQueryDto {
  @ApiProperty({ description: 'Transaction type name', required: false })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({ description: 'FPPR number', required: false })
  @IsOptional()
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'Reference number', required: false })
  @IsOptional()
  @IsString()
  REFERENCE_NUMBER?: string;

  @ApiProperty({ description: 'Item code', required: false })
  @IsOptional()
  @IsString()
  ITEM_CODE?: string;

  @ApiProperty({ description: 'Item number', required: false })
  @IsOptional()
  @IsString()
  ITEM_NUMBER?: string;

  @ApiProperty({ description: 'Item description', required: false })
  @IsOptional()
  @IsString()
  ITEM_DESCRIPTION?: string;

  @ApiProperty({ description: 'Organization ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Organization code', required: false })
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

  @ApiProperty({ description: 'Transaction date', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  TRANSACTION_DATE?: Date;

  @ApiProperty({ description: 'Unit of measure', required: false })
  @IsOptional()
  @IsString()
  UOM?: string;

  @ApiProperty({ description: 'Quantity', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  QUANTITY?: number;

  @ApiProperty({ description: 'Transacted by', required: false })
  @IsOptional()
  @IsString()
  TRANSACT_BY?: string;

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
