import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ApTermsDto {
  @ApiProperty({ description: 'Name', example: 'NET30' })
  @IsOptional()
  @IsString()
  TERM_NAME?: string;

  @ApiProperty({ description: 'Term ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TERM_ID?: number;

  @ApiProperty({ description: 'Description', example: 'Net 30 days' })
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

  @ApiProperty({ description: 'Day of terms', example: 30 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  DAY_OF_TERMS?: number;
}

export class ApTermsQueryDto {  
  @ApiProperty({ description: 'Name', required: false })
  @IsOptional()
  @IsString()
  TERM_NAME?: string;

  @ApiProperty({ description: 'Term ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TERM_ID?: number;

  @ApiProperty({ description: 'Description', required: false })
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
