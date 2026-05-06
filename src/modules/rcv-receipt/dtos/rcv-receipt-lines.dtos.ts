import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateRcvReceiptLinesDto {
  @ApiProperty({ example: 'LINE-2026-0001' })
  @IsString()
  SOURCE_LINE_ID: string;

  @ApiProperty({ example: 'HDR-2026-0001' })
  @IsString()
  SOURCE_HEADER_ID: string;

  @ApiProperty({ example: 'PO26040001' })
  @IsOptional()
  @IsString()
  PO_NUMBER: string;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  PO_LINE_NUMBER: number;

  @ApiProperty({ example: 'ISO26040001', required: false })
  @IsOptional()
  @IsString()
  ISO_NUMBER?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  ISO_LINE_NUMBER?: number;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  INVENTORY_ITEM_ID: number;

  @ApiProperty({ example: 'PCS' })
  @IsString()
  UOM_CODE: string;

  @ApiProperty({ example: 25 })
  @IsNumber()
  QUANTITY: number;

  @ApiProperty({ example: 'GOOD-RK-1' })
  @IsString()
  SUBINVENTORY: string;

  @ApiProperty({ example: 100200300 })
  @IsNumber()
  LOCATOR_ID: number;

  @ApiProperty({ example: 0, required: false })
  @IsOptional()
  @IsNumber()
  QUANTITY_SELISIH?: number;

  @ApiProperty({ example: 'GOOD-RK-1', required: false, maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  SUBINVENTORY_SELISIH?: string;

  @ApiProperty({ example: 100200300, required: false })
  @IsOptional()
  @IsNumber()
  LOCATOR_ID_SELISIH?: number;
}