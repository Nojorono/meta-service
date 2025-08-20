import { ApiProperty } from '@nestjs/swagger';

export class CoaExpenseDto {
  @ApiProperty({
    description: 'Expense name',
    example: 'BIAYA BANK',
  })
  EXPENSE_NAME: string;

  @ApiProperty({
    description: 'COA combinations',
    example: 'NNA.A208.00000000.202213.000000.618000004.000.0000.000.000',
  })
  COA_COMBINATIONS: string;

  @ApiProperty({
    description: 'Code combination ID',
    example: 26291,
  })
  CODE_COMBINATION_ID: number;

  @ApiProperty({
    description: 'FPPR type code',
    example: 'MD',
    required: false,
  })
  FPPR_TYPE_CODE?: string;

  @ApiProperty({
    description: 'FPPR type description',
    example: 'Luar Kota (Multiple Day)',
    required: false,
  })
  FPPR_TYPE_DESCRIPTION?: string;

  @ApiProperty({
    description: 'Enabled flag',
    example: 'Y',
  })
  ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Start date active',
    example: '2000-01-01 00:00:00.000',
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
    description: 'Organization code',
    example: 'SMD',
    required: false,
  })
  ORGANIZATION_CODE?: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'SUKABUMI',
    required: false,
  })
  ORGANIZATION_NAME?: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 249,
    required: false,
  })
  ORGANIZATION_ID?: number;

  @ApiProperty({
    description: 'Org name',
    example: 'NNA_SKB_OU',
    required: false,
  })
  ORG_NAME?: string;

  @ApiProperty({
    description: 'Org ID',
    example: '218',
    required: false,
  })
  ORG_ID?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-04-23 13:27:20.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;
}

export class CoaExpenseQueryDto {
  @ApiProperty({
    description: 'Expense name to filter by',
    example: 'BIAYA BANK',
    required: false,
  })
  EXPENSE_NAME?: string;

  @ApiProperty({
    description: 'COA combinations to filter by',
    example: 'NNA.A208.00000000.202213.000000.618000004.000.0000.000.000',
    required: false,
  })
  COA_COMBINATIONS?: string;

  @ApiProperty({
    description: 'FPPR type code to filter by',
    example: 'MD',
    required: false,
  })
  FPPR_TYPE_CODE?: string;

  @ApiProperty({
    description: 'Organization code to filter by',
    example: 'SKB',
    required: false,
  })
  ORGANIZATION_CODE?: string;

  @ApiProperty({
    description: 'Enabled flag to filter by',
    example: 'Y',
    required: false,
  })
  ENABLED_FLAG?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  PAGE?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  LIMIT?: number;
}
