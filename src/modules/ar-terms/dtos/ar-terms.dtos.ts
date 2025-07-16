import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ArTermsDto {
  @ApiProperty({ description: 'Term ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  TERM_ID?: number;

  @ApiProperty({ description: 'Name', example: 'NET30' })
  @IsOptional()
  @IsString()
  NAME?: string;

  @ApiProperty({ description: 'Description', example: 'Net 30 days' })
  @IsOptional()
  @IsString()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Type', example: 'IMMEDIATE' })
  @IsOptional()
  @IsString()
  TYPE?: string;

  @ApiProperty({ description: 'Due days', example: 30 })
  @IsOptional()
  @IsNumber()
  DUE_DAYS?: number;

  @ApiProperty({ description: 'Due day of month', example: 1 })
  @IsOptional()
  @IsNumber()
  DUE_DAY_OF_MONTH?: number;

  @ApiProperty({ description: 'Due months forward', example: 0 })
  @IsOptional()
  @IsNumber()
  DUE_MONTHS_FORWARD?: number;

  @ApiProperty({ description: 'Discount days', example: 10 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_DAYS?: number;

  @ApiProperty({ description: 'Discount day of month', example: 1 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_DAY_OF_MONTH?: number;

  @ApiProperty({ description: 'Discount months forward', example: 0 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_MONTHS_FORWARD?: number;

  @ApiProperty({ description: 'Discount percent', example: 2.5 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_PERCENT?: number;

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

  @ApiProperty({ description: 'Attribute1', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE1?: string;

  @ApiProperty({ description: 'Attribute2', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE2?: string;

  @ApiProperty({ description: 'Attribute3', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE3?: string;

  @ApiProperty({ description: 'Attribute4', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE4?: string;

  @ApiProperty({ description: 'Attribute5', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE5?: string;

  @ApiProperty({ description: 'Attribute6', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE6?: string;

  @ApiProperty({ description: 'Attribute7', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE7?: string;

  @ApiProperty({ description: 'Attribute8', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE8?: string;

  @ApiProperty({ description: 'Attribute9', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE9?: string;

  @ApiProperty({ description: 'Attribute10', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE10?: string;

  @ApiProperty({ description: 'Attribute11', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE11?: string;

  @ApiProperty({ description: 'Attribute12', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE12?: string;

  @ApiProperty({ description: 'Attribute13', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE13?: string;

  @ApiProperty({ description: 'Attribute14', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE14?: string;

  @ApiProperty({ description: 'Attribute15', example: 'Additional info' })
  @IsOptional()
  @IsString()
  ATTRIBUTE15?: string;

  @ApiProperty({ description: 'Attribute category', example: 'GENERAL' })
  @IsOptional()
  @IsString()
  ATTRIBUTE_CATEGORY?: string;

  @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  CREATION_DATE?: Date;

  @ApiProperty({ description: 'Created by', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  CREATED_BY?: string;

  @ApiProperty({ description: 'Last update date', example: '2023-01-01T00:00:00Z' })
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

export class ArTermsQueryDto {
  @ApiProperty({ description: 'Term ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  TERM_ID?: number;

  @ApiProperty({ description: 'Name', required: false })
  @IsOptional()
  @IsString()
  NAME?: string;

  @ApiProperty({ description: 'Type', required: false })
  @IsOptional()
  @IsString()
  TYPE?: string;

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
