import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SalesOrderTypesDto {
  @ApiProperty({ description: 'Transaction type ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TRANSACTION_TYPE_ID?: number;

  @ApiProperty({
    description: 'Transaction type name',
    example: 'Standard Order',
  })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({
    description: 'Description',
    example: 'Standard sales order type',
  })
  @IsOptional()
  @IsString()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Order category code', example: 'ORDER' })
  @IsOptional()
  @IsString()
  ORDER_CATEGORY_CODE?: string;

  @ApiProperty({ description: 'Start date active', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  START_DATE_ACTIVE?: Date;

  @ApiProperty({ description: 'End date active', example: '2023-12-31' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  END_DATE_ACTIVE?: Date;

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

export class SalesOrderTypesQueryDto {
  @ApiProperty({ description: 'Transaction type ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TRANSACTION_TYPE_ID?: number;

  @ApiProperty({ description: 'Transaction type name', required: false })
  @IsOptional()
  @IsString()
  TRANSACTION_TYPE_NAME?: string;

  @ApiProperty({ description: 'Order category code', required: false })
  @IsOptional()
  @IsString()
  ORDER_CATEGORY_CODE?: string;

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
