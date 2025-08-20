import { IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SalesOrderTypesDto {
  @ApiProperty({ description: 'Order category code', example: 'RETURN' })
  @IsOptional()
  @IsString()
  ORDER_CATEGORY_CODE?: string;

  @ApiProperty({
    description: 'Transaction type name',
    example: 'BGR-Canvas Retur Beli',
  })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({ description: 'Transaction type ID', example: 1438 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TRANSACTION_TYPE_ID?: number;

  @ApiProperty({
    description: 'Start date active',
    example: '2000-01-01 00:00:00.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'End date active',
    example: '2024-12-31 23:59:59.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  END_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Return transaction type name',
    example: 'Return Transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  RETURN_TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({
    description: 'Return transaction type ID',
    example: 1001,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  RETURN_TRANSACTION_TYPE_ID?: number;

  @ApiProperty({
    description: 'Return start date active',
    example: '2000-01-01 00:00:00.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  RETURN_START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Return end date active',
    example: '2024-12-31 23:59:59.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  RETURN_END_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Line transaction type name',
    example: 'BGR-Line Retur Credit Only',
    required: false,
  })
  @IsOptional()
  @IsString()
  LINE_TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({
    description: 'Line transaction type ID',
    example: 1145,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  LINE_TRANSACTION_TYPE_ID?: number;

  @ApiProperty({
    description: 'Line start date active',
    example: '2000-01-01 00:00:00.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  LINE_START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Line end date active',
    example: '2024-12-31 23:59:59.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  LINE_END_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Line discount transaction type name',
    example: 'Line Discount Transaction',
    required: false,
  })
  @IsOptional()
  @IsString()
  LINE_DISC_TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({
    description: 'Line discount transaction type ID',
    example: 1001,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  LINE_DISC_TRANSACTION_TYPE_ID?: number;

  @ApiProperty({
    description: 'Line discount start date active',
    example: '2000-01-01 00:00:00.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  LINE_DISC_START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Line discount end date active',
    example: '2024-12-31 23:59:59.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  LINE_DISC_END_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Transaction type DMS',
    example: 'RETUR',
    required: false,
  })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_DMS?: string;

  @ApiProperty({ description: 'Organization code', example: 'BGR' })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({ description: 'Organization name', example: 'BOGOR' })
  @IsOptional()
  @IsString()
  ORGANIZATION_NAME?: string;

  @ApiProperty({ description: 'Organization ID', example: 241 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Org name', example: 'NNA_BGR_OU' })
  @IsOptional()
  @IsString()
  ORG_NAME?: string;

  @ApiProperty({ description: 'Org ID', example: '201' })
  @IsOptional()
  @IsString()
  ORG_ID?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-04-15 15:27:36.000',
    required: false,
  })
  @IsOptional()
  @IsString()
  LAST_UPDATE_DATE?: string;
}

export class SalesOrderTypesQueryDto {
  @ApiProperty({
    description: 'Order category code to filter by',
    example: 'RETURN',
    required: false,
  })
  @IsOptional()
  @IsString()
  ORDER_CATEGORY_CODE?: string;

  @ApiProperty({
    description: 'Transaction type name to filter by',
    example: 'BGR-Canvas Retur Beli',
    required: false,
  })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({
    description: 'Transaction type ID to filter by',
    example: 1438,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TRANSACTION_TYPE_ID?: number;

  @ApiProperty({
    description: 'Organization code to filter by',
    example: 'BGR',
    required: false,
  })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({
    description: 'Transaction type DMS to filter by',
    example: 'RETUR',
    required: false,
  })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_DMS?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
