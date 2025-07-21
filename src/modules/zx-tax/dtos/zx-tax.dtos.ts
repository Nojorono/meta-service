import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ZxTaxDto {
  @ApiProperty({ description: 'Tax ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TAX_ID?: number;

  @ApiProperty({ description: 'Tax name', example: 'VAT' })
  @IsOptional()
  @IsString()
  TAX_NAME?: string;

  @ApiProperty({ description: 'Tax type code', example: 'VAT' })
  @IsOptional()
  @IsString()
  TAX_TYPE_CODE?: string;

  @ApiProperty({ description: 'Tax regime code', example: 'STANDARD' })
  @IsOptional()
  @IsString()
  TAX_REGIME_CODE?: string;

  @ApiProperty({
    description: 'Tax regime name',
    example: 'Standard Tax Regime',
  })
  @IsOptional()
  @IsString()
  TAX_REGIME_NAME?: string;

  @ApiProperty({ description: 'Tax jurisdiction code', example: 'ID' })
  @IsOptional()
  @IsString()
  TAX_JURISDICTION_CODE?: string;

  @ApiProperty({ description: 'Tax jurisdiction name', example: 'Indonesia' })
  @IsOptional()
  @IsString()
  TAX_JURISDICTION_NAME?: string;

  @ApiProperty({ description: 'Tax rate', example: 11.0 })
  @IsOptional()
  @IsNumber()
  TAX_RATE?: number;

  @ApiProperty({ description: 'Tax rate ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TAX_RATE_ID?: number;

  @ApiProperty({ description: 'Tax rate code', example: 'STANDARD_RATE' })
  @IsOptional()
  @IsString()
  TAX_RATE_CODE?: string;

  @ApiProperty({ description: 'Tax rate name', example: 'Standard Rate' })
  @IsOptional()
  @IsString()
  TAX_RATE_NAME?: string;

  @ApiProperty({ description: 'Content owner ID', example: 1 })
  @IsOptional()
  @IsNumber()
  CONTENT_OWNER_ID?: number;

  @ApiProperty({ description: 'Tax class', example: 'OUTPUT' })
  @IsOptional()
  @IsString()
  TAX_CLASS?: string;

  @ApiProperty({ description: 'Effective from', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  EFFECTIVE_FROM?: Date;

  @ApiProperty({ description: 'Effective to', example: '2023-12-31' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  EFFECTIVE_TO?: Date;

  @ApiProperty({ description: 'Active flag', example: 'Y' })
  @IsOptional()
  @IsString()
  ACTIVE_FLAG?: string;

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

export class ZxTaxQueryDto {
  @ApiProperty({ description: 'Tax ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TAX_ID?: number;

  @ApiProperty({ description: 'Tax name', required: false })
  @IsOptional()
  @IsString()
  TAX_NAME?: string;

  @ApiProperty({ description: 'Tax type code', required: false })
  @IsOptional()
  @IsString()
  TAX_TYPE_CODE?: string;

  @ApiProperty({ description: 'Tax regime code', required: false })
  @IsOptional()
  @IsString()
  TAX_REGIME_CODE?: string;

  @ApiProperty({ description: 'Tax jurisdiction code', required: false })
  @IsOptional()
  @IsString()
  TAX_JURISDICTION_CODE?: string;

  @ApiProperty({ description: 'Active flag', required: false })
  @IsOptional()
  @IsString()
  ACTIVE_FLAG?: string;

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
