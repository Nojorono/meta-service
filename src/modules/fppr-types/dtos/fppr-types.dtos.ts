import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FpprTypesDto {
  @ApiProperty({ description: 'FPPR Type Code', example: 'TYPE01' })
  @IsString()
  @IsOptional()
  FPPR_TYPE_CODE?: string;

  @ApiProperty({
    description: 'Description of the FPPR type',
    example: 'Standard FPPR Type',
  })
  @IsString()
  @IsOptional()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Enabled Flag', example: 'Y' })
  @IsString()
  @IsOptional()
  ENABLED_FLAG?: string;

  @ApiProperty({
    description: 'Start date when the FPPR type is active',
    example: '2023-01-01',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  START_DATE_ACTIVE?: Date;

  @ApiProperty({
    description: 'End date when the FPPR type is no longer active',
    example: '2023-12-31',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  END_DATE_ACTIVE?: Date;

  @ApiProperty({
    description: 'Last update date of the FPPR type',
    example: '2023-10-01',
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  LAST_UPDATE_DATE: Date;
}

export class FpprTypesQueryDto {
  @ApiProperty({ description: 'FPPR Type Code', example: 'TYPE01' })
  @IsString()
  @IsOptional()
  FPPR_TYPE_CODE?: string;

  @ApiProperty({
    description: 'Description of the FPPR type',
    example: 'Standard FPPR Type',
  })
  @IsString()
  @IsOptional()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Enabled Flag', example: 'Y' })
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
