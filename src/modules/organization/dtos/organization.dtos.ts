import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class OrganizationDto {
  @ApiProperty({
    description: 'Organization ID',
    example: 101,
  })
  ORGANIZATION_ID: number;

  @ApiProperty({
    description: 'Organization code',
    example: 'ORG001',
  })
  ORGANIZATION_CODE: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'Sales Division',
  })
  ORGANIZATION_NAME: string;

  @ApiProperty({
    description: 'Organization type',
    example: 'SALES',
  })
  ORGANIZATION_TYPE: string;

  @ApiProperty({
    description: 'Organization enabled flag',
    example: 'Y',
  })
  ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Organization start date',
    example: '2020-01-01',
    required: false,
  })
  START_DATE?: string;

  @ApiProperty({
    description: 'Organization end date',
    example: '2030-12-31',
    required: false,
  })
  END_DATE?: string;

  @ApiProperty({
    description: 'Parent organization ID',
    example: 100,
    required: false,
  })
  PARENT_ORGANIZATION_ID?: number;

  @ApiProperty({
    description: 'Location code',
    example: 'JKT',
    required: false,
  })
  LOCATION_CODE?: string;

  @ApiProperty({
    description: 'Manager employee ID',
    example: 'EMP001',
    required: false,
  })
  MANAGER_EMPLOYEE_ID?: string;
}

export class OrganizationQueryDto {
  @ApiProperty({
    description: 'Organization code to filter by',
    example: 'ORG001',
    required: false,
  })
  @IsOptional()
  @IsString()
  organizationCode?: string;

  @ApiProperty({
    description: 'Organization name to filter by',
    example: 'Sales',
    required: false,
  })
  @IsOptional()
  @IsString()
  organizationName?: string;

  @ApiProperty({
    description: 'Organization type to filter by',
    example: 'SALES',
    required: false,
  })
  @IsOptional()
  @IsString()
  organizationType?: string;

  @ApiProperty({
    description: 'Location code to filter by',
    example: 'JKT',
    required: false,
  })
  @IsOptional()
  @IsString()
  locationCode?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number;
}
