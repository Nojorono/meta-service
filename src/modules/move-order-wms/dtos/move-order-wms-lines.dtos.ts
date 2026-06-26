import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMoveOrderWmsLinesDto {
  private static readonly ifaceStatuses = ['READY', 'PROCESS', 'SUCCESS', 'ERROR'] as const;

  @ApiProperty({ example: 1 })
  @IsNumber()
  LINE_NUMBER: number;

  @ApiProperty({ example: 241 })
  @IsNumber()
  ORGANIZATION_ID: number;

  @ApiProperty({ example: 21001 })
  @IsNumber()
  INVENTORY_ITEM_ID: number;

  @ApiProperty({ example: 'KECIL', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  FROM_SUBINVENTORY_CODE: string;

  @ApiProperty({ example: 1001, required: false })
  @IsOptional()
  @IsNumber()
  FROM_LOCATOR_ID?: number;

  @ApiProperty({ example: 'CANVAS', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  TO_SUBINVENTORY_CODE: string;

  @ApiProperty({ example: 1002, required: false })
  @IsOptional()
  @IsNumber()
  TO_LOCATOR_ID?: number;

  @ApiProperty({ example: 'BKS', maxLength: 3 })
  @IsString()
  @MaxLength(3)
  UOM_CODE: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  QUANTITY: number;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  DATE_REQUIRED: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  TRANSACTION_SOURCE_TYPE_ID: number;

  @ApiProperty({ example: 7 })
  @IsNumber()
  LINE_STATUS: number;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  STATUS_DATE: string;

  @ApiProperty({ example: 'CREATE', required: false, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  OPERATION?: string;

  @ApiProperty({ example: 'T', required: false, maxLength: 1 })
  @IsOptional()
  @IsString()
  @MaxLength(1)
  DB_FLAG?: string;

  @ApiProperty({ example: 'WMS', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  SOURCE_SYSTEM?: string;

  @ApiProperty({ example: 'BATCH-001', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  SOURCE_BATCH_ID?: string;

  @ApiProperty({ example: 'HDR-001', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  SOURCE_HEADER_ID?: string;

  @ApiProperty({ example: 'LINE-001', required: false, maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  SOURCE_LINE_ID?: string;

  @ApiProperty({ example: 'READY', required: false, maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @IsIn(CreateMoveOrderWmsLinesDto.ifaceStatuses)
  IFACE_STATUS?: string;
}
