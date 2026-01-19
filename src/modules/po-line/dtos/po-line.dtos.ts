import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PoLineDto {
  @ApiProperty({
    description: 'PO Segment 1 (PO Number)',
    example: 'PO-2024-001',
  })
  SEGMENT1: string;

  @ApiProperty({
    description: 'Item Description',
    example: 'Laptop Dell Inspiron 15',
  })
  ITEM_DESCRIPTION: string;

  @ApiProperty({
    description: 'PO Line ID',
    example: 12345,
  })
  PO_LINE_ID: number;
}

export class PoLineQueryDto {
  @ApiProperty({
    description: 'Vendor ID to filter by',
    example: 1001,
    required: true,
  })
  @IsNumber()
  @Type(() => Number)
  vendor_id: number;

  @ApiProperty({
    description: 'PO Segment 1 (PO Number) to filter by',
    example: 'PO-2024-001',
    required: false,
  })
  @IsOptional()
  @IsString()
  segment1?: string;

  @ApiProperty({
    description: 'Item description to filter by',
    example: 'Laptop',
    required: false,
  })
  @IsOptional()
  @IsString()
  item_description?: string;

  @ApiProperty({
    description: 'PO Line ID to filter by',
    example: 12345,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  po_line_id?: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
