import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreateMoveOrderWmsLinesDto } from './move-order-wms-lines.dtos';

export class CreateMoveOrderWmsDto {
  private static readonly ifaceStatuses = ['READY', 'PROCESS', 'SUCCESS', 'ERROR'] as const;

  @ApiProperty({ example: 'JAT/SPB/2024/01/000002', maxLength: 30 })
  @IsString()
  @MaxLength(30)
  REQUEST_NUMBER: string;

  @ApiProperty({ example: 121 })
  @IsNumber()
  TRANSACTION_TYPE_ID: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  MOVE_ORDER_TYPE: number;

  @ApiProperty({ example: 241 })
  @IsNumber()
  ORGANIZATION_ID: number;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  DATE_REQUIRED: string;

  @ApiProperty({ example: 'KECIL', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  FROM_SUBINVENTORY_CODE: string;

  @ApiProperty({ example: 'CANVAS', maxLength: 10 })
  @IsString()
  @MaxLength(10)
  TO_SUBINVENTORY_CODE: string;

  @ApiProperty({ example: 7 })
  @IsNumber()
  HEADER_STATUS: number;

  @ApiProperty({ example: '2024-01-01' })
  @IsString()
  STATUS_DATE: string;

  @ApiProperty({ example: 'FPPR Tambahan', maxLength: 30, required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  ATTRIBUTE_CATEGORY?: string;

  @ApiProperty({ example: 'string', required: false, maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE7?: string;

  @ApiProperty({ example: 'string', required: false, maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE8?: string;

  @ApiProperty({ example: 'string', required: false, maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE9?: string;

  @ApiProperty({ example: 'string', required: false, maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE10?: string;

  @ApiProperty({ example: 'string', required: false, maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE11?: string;

  @ApiProperty({ example: 'string', required: false, maxLength: 150 })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE12?: string;

  @ApiProperty({
    example: 'JAT/CP/2024/01/000001',
    required: false,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE13?: string;

  @ApiProperty({
    example: 'JAT/SPB/2024/01/000002',
    required: false,
    maxLength: 150,
  })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  ATTRIBUTE14?: string;

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

  @ApiProperty({ example: 'WMS', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  SOURCE_SYSTEM: string;

  @ApiProperty({ example: '1234567890', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  SOURCE_HEADER_ID: string;

  @ApiProperty({ example: 'READY', required: false, maxLength: 10 })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  @IsIn(CreateMoveOrderWmsDto.ifaceStatuses)
  IFACE_STATUS?: string;

  @ApiProperty({ example: 'MOVE_ORDER', required: false, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  IFACE_MODE?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  TOTAL_LINES: number;

  @ApiProperty({ type: [CreateMoveOrderWmsLinesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMoveOrderWmsLinesDto)
  LINES: CreateMoveOrderWmsLinesDto[];
}

export class MoveOrderWmsResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({
    example: 'Move order WMS interface data inserted successfully',
  })
  message: string;

  @ApiProperty({ nullable: true })
  data: any;
}
