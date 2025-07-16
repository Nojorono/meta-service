import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApInvoiceTypesDto {
  @ApiProperty({ description: 'Invoice type lookup code', example: 'STANDARD' })
  @IsOptional()
  @IsString()
  INVOICE_TYPE_CODE?: string;

  @ApiProperty({ description: 'Invoice type name', example: 'Standard Invoice' })
  @IsOptional()
  @IsString()
  INVOICE_TYPE_NAME?: string;
  
  @ApiProperty({ description: 'Invoice Description', example: 'Adjusment document' })
  @IsOptional()
  @IsString()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Enabled flag', example: 'Y' })
  @IsOptional()
  @IsString()
  ENABLED_FLAG?: string;

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

  @ApiProperty({ description: 'Last update date', example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  LAST_UPDATE_DATE?: Date;

  @ApiProperty({ description: 'Invoice Type DMS', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  INVOICE_TYPE_DMS?: string;
}

export class ApInvoiceTypesQueryDto {
  @ApiProperty({ description: 'Invoice type lookup code', required: false })
  @IsOptional()
  @IsString()
  INVOICE_TYPE_CODE?: string;

  @ApiProperty({ description: 'Invoice type name', required: false })
  @IsOptional()
  @IsString()
  INVOICE_TYPE_NAME?: string;

  @ApiProperty({ description: 'Invoice type name', required: false })
  @IsOptional()
  @IsString()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Enabled flag', required: false })
  @IsOptional()
  @IsString()
  ENABLED_FLAG?: string;

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