import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FpprTypesDto {
  @ApiProperty({ description: 'Lookup type', example: 'FPPR_TYPE' })
  @IsOptional()
  @IsString()
  LOOKUP_TYPE?: string;

  @ApiProperty({ description: 'Lookup code', example: 'CREDIT' })
  @IsOptional()
  @IsString()
  LOOKUP_CODE?: string;

  @ApiProperty({ description: 'Meaning', example: 'Credit' })
  @IsOptional()
  @IsString()
  MEANING?: string;

  @ApiProperty({ description: 'Description', example: 'Credit FPPR type' })
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

  @ApiProperty({ description: 'Territory code', example: 'GLOBAL' })
  @IsOptional()
  @IsString()
  TERRITORY_CODE?: string;

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

  @ApiProperty({ description: 'Source lang', example: 'US' })
  @IsOptional()
  @IsString()
  SOURCE_LANG?: string;

  @ApiProperty({ description: 'Security group ID', example: 1 })
  @IsOptional()
  @IsNumber()
  SECURITY_GROUP_ID?: number;

  @ApiProperty({ description: 'View application ID', example: 660 })
  @IsOptional()
  @IsNumber()
  VIEW_APPLICATION_ID?: number;
}

export class FpprTypesQueryDto {
  @ApiProperty({ description: 'Lookup type', required: false })
  @IsOptional()
  @IsString()
  LOOKUP_TYPE?: string;

  @ApiProperty({ description: 'Lookup code', required: false })
  @IsOptional()
  @IsString()
  LOOKUP_CODE?: string;

  @ApiProperty({ description: 'Meaning', required: false })
  @IsOptional()
  @IsString()
  MEANING?: string;

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
