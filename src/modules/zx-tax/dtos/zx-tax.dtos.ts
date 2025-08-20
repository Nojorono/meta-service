import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ZxTaxDto {
  @ApiProperty({ description: 'Tax rate code', example: 'VAT IN 1.2% NR' })
  @IsOptional()
  @IsString()
  TAX_RATE_CODE?: string;

  @ApiProperty({ description: 'Percentage Rate', example: '1.2' })
  @IsOptional()
  @IsNumber()
  PERCENTAGE_RATE?: number;

  @ApiProperty({ description: 'Enabled Flag', example: 'Y' })
  @IsOptional()
  @IsString()
  ENABLED_FLAG?: string;

  @ApiProperty({ description: 'Start Date', example: '2025-08-01' })
  @IsOptional()
  @IsDate()
  START_DATE_ACTIVE?: Date;

  @ApiProperty({ description: 'End Date', example: '2025-12-31' })
  @IsOptional()
  @IsDate()
  END_DATE_ACTIVE?: Date;

  @ApiProperty({ description: 'Last Update Date', example: '2025-12-31' })
  @IsOptional()
  @IsDate()
  LAST_UPDATE_DATE?: Date;
}

export class ZxTaxQueryDto {
  @ApiProperty({ description: 'Tax rate code', required: false })
  @IsOptional()
  @IsString()
  TAX_RATE_CODE?: string;

  @ApiProperty({ description: 'Percentage Rate', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  PERCENTAGE_RATE?: number;

  @ApiProperty({ description: 'Page, required: false' })
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
