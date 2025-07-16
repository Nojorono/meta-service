import { ApiProperty } from '@nestjs/swagger';

export class SalesActivityDto {
  @ApiProperty({
    description: 'Activity name',
    example: 'SB2 - Retur Beli',
  })
  ACTIVITY_NAME: string;

  @ApiProperty({
    description: 'Receipt type DMS',
    example: 'RETUR',
  })
  RECEIPT_TYPE_DMS: string;

  @ApiProperty({
    description: 'Status',
    example: 'A',
  })
  STATUS: string;

  @ApiProperty({
    description: 'Start date active',
    example: '2020-01-01',
    required: false,
  })
  START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'End date active',
    example: '2030-12-31',
    required: false,
  })
  END_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-05-21 18:16:47.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;

  @ApiProperty({
    description: 'Receivables TRX ID',
    example: 5286,
    required: false,
  })
  RECEIVABLES_TRX_ID?: number;

  @ApiProperty({
    description: 'Organization code',
    example: 'SB2',
    required: false,
  })
  ORGANIZATION_CODE?: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'SURABAYA',
    required: false,
  })
  ORGANIZATION_NAME?: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 253,
    required: false,
  })
  ORGANIZATION_ID?: number;

  @ApiProperty({
    description: 'Org name',
    example: 'NNA_SB2_OU',
    required: false,
  })
  ORG_NAME?: string;

  @ApiProperty({
    description: 'Org ID',
    example: '229',
    required: false,
  })
  ORG_ID?: string;
}

export class SalesActivityQueryDto {
  @ApiProperty({
    description: 'Activity name to filter by',
    example: 'SB2 - Retur Beli',
    required: false,
  })
  activityName?: string;

  @ApiProperty({
    description: 'Receipt type DMS to filter by',
    example: 'RETUR',
    required: false,
  })
  receiptTypeDms?: string;

  @ApiProperty({
    description: 'Status to filter by',
    example: 'A',
    required: false,
  })
  status?: string;

  @ApiProperty({
    description: 'Organization code to filter by',
    example: 'SB2',
    required: false,
  })
  organizationCode?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  limit?: number;
}
