import { ApiProperty } from '@nestjs/swagger';

export class TransactionTypeDto {
  @ApiProperty({
    description: 'Transaction type name',
    example: 'FPPR Awal',
  })
  TRANSACTION_TYPE_NAME: string;

  @ApiProperty({
    description: 'Transaction type ID',
    example: 105,
  })
  TRANSACTION_TYPE_ID: number;

  @ApiProperty({
    description: 'Description',
    example: 'FPPR Awal',
    required: false,
  })
  DESCRIPTION?: string;

  @ApiProperty({
    description: 'Status',
    example: 7,
    required: false,
  })
  STATUS?: number;

  @ApiProperty({
    description: 'Status description',
    example: 'Pre Approved',
    required: false,
  })
  STATUS_DESCRIPTION?: string;

  @ApiProperty({
    description: 'Transaction type DMS',
    example: 'SPB-ORIGINAL',
    required: false,
  })
  TRANSACTION_TYPE_DMS?: string;

  @ApiProperty({
    description: 'Move order type',
    example: 1,
    required: false,
  })
  MOVE_ORDER_TYPE?: number;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-02-21 15:43:20.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;

  @ApiProperty({
    description: 'Transaction source type ID',
    example: 4,
    required: false,
  })
  TRANSACTION_SOURCE_TYPE_ID?: number;

  @ApiProperty({
    description: 'Organization code',
    example: 'BGR',
    required: false,
  })
  ORGANIZATION_CODE?: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'BOGOR',
    required: false,
  })
  ORGANIZATION_NAME?: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 241,
    required: false,
  })
  ORGANIZATION_ID?: number;

  @ApiProperty({
    description: 'Org name',
    example: 'NNA_BGR_OU',
    required: false,
  })
  ORG_NAME?: string;

  @ApiProperty({
    description: 'Org ID',
    example: '201',
    required: false,
  })
  ORG_ID?: string;

  @ApiProperty({
    description: 'Code combination ID',
    example: 12345,
    required: false,
  })
  CODE_COMBINATION_ID?: number;
}

export class TransactionTypeQueryDto {
  @ApiProperty({
    description: 'Transaction type name to filter by',
    example: 'FPPR Awal',
    required: false,
  })
  transactionTypeName?: string;

  @ApiProperty({
    description: 'Transaction type DMS to filter by',
    example: 'SPB-ORIGINAL',
    required: false,
  })
  transactionTypeDms?: string;

  @ApiProperty({
    description: 'Status to filter by',
    example: 7,
    required: false,
  })
  status?: number;

  @ApiProperty({
    description: 'Organization code to filter by',
    example: 'BGR',
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
