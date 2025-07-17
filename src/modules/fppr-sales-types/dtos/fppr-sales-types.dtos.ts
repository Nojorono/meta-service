import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FpprSalesTypesDto {
  @ApiProperty({ description: 'FPPR Sales Type Code', example: 'STANDARD' })
  @IsString()
  @IsOptional()
  FPPR_SALES_TYPE_CODE?: string;

  @ApiProperty({ description: 'Description of the sales type', example: 'Standard Sales Type' })
  @IsString()
  @IsOptional()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Enabled flag for the sales type', example: 'Y' })
  @IsString()
  @IsOptional()
  ENABLED_FLAG?: string;

  @ApiProperty({ description: 'Start date when the sales type is active', example: '2023-01-01' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  START_DATE_ACTIVE?: Date;

  @ApiProperty({ description: 'End date when the sales type is no longer active', example: '2023-12-31' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  END_DATE_ACTIVE?: Date;

  @ApiProperty({ description: 'Last update date of the sales type', example: '2023-10-01' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  LAST_UPDATE_DATE?: Date;
}

export class FpprSalesTypesQueryDto {
  @ApiProperty({ description: 'FPPR Sales Type Code', example: 'STANDARD' })
  @IsString()
  @IsOptional()
  FPPR_SALES_TYPE_CODE?: string;

  @ApiProperty({ description: 'Description of the sales type', example: 'Standard Sales Type' })
  @IsString()
  @IsOptional()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Enabled flag for the sales type', example: 'Y' })
  @IsString()
  @IsOptional()
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
