import { ApiProperty } from '@nestjs/swagger';

export class HrOperatingUnitsDto {
  @ApiProperty({
    description: 'Business Group ID',
    example: 101,
    required: false,
  })
  BUSINESS_GROUP_ID?: number;

  @ApiProperty({
    description: 'Date From',
    example: '2020-01-01',
    required: false,
  })
  DATE_FROM?: string;

  @ApiProperty({
    description: 'Date To',
    example: '2030-12-31',
    required: false,
  })
  DATE_TO?: string;

  @ApiProperty({
    description: 'Default Legal Context ID',
    example: 'LEGAL001',
    required: false,
  })
  DEFAULT_LEGAL_CONTEXT_ID?: string;

  @ApiProperty({
    description: 'Location Code',
    example: 'JKT',
    required: false,
  })
  LOCATION_CODE?: string;

  @ApiProperty({
    description: 'Location Description',
    example: 'Jakarta Head Office',
    required: false,
  })
  LOCATION_DESCRIPTION?: string;

  @ApiProperty({
    description: 'Name',
    example: 'Jakarta Operating Unit',
  })
  NAME: string;

  @ApiProperty({
    description: 'Organization Code',
    example: 'ORG001',
    required: false,
  })
  ORG_CODE?: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 201,
  })
  ORG_ID: number;

  @ApiProperty({
    description: 'Organization Name',
    example: 'Jakarta Sales Organization',
    required: false,
  })
  ORG_NAME?: string;

  @ApiProperty({
    description: 'Organization ID (Alternative)',
    example: 201,
    required: false,
  })
  ORGANIZATION_ID?: number;

  @ApiProperty({
    description: 'Set of Books ID',
    example: 'SOB001',
    required: false,
  })
  SET_OF_BOOKS_ID?: string;

  @ApiProperty({
    description: 'Short Code',
    example: 'JKT',
    required: false,
  })
  SHORT_CODE?: string;

  @ApiProperty({
    description: 'Usable Flag',
    example: 'Y',
    required: false,
  })
  USABLE_FLAG?: string;
}

export class HrOperatingUnitsQueryDto {
  @ApiProperty({
    description: 'Business Group ID to filter by',
    example: 101,
    required: false,
  })
  businessGroupId?: number;

  @ApiProperty({
    description: 'Location Code to filter by',
    example: 'JKT',
    required: false,
  })
  locationCode?: string;

  @ApiProperty({
    description: 'Organization Name to filter by',
    example: 'Jakarta',
    required: false,
  })
  orgName?: string;

  @ApiProperty({
    description: 'Organization Code to filter by',
    example: 'ORG001',
    required: false,
  })
  orgCode?: string;

  @ApiProperty({
    description: 'Short Code to filter by',
    example: 'JKT',
    required: false,
  })
  shortCode?: string;

  @ApiProperty({
    description: 'Usable Flag to filter by (Y/N)',
    example: 'Y',
    required: false,
  })
  usableFlag?: string;
}

