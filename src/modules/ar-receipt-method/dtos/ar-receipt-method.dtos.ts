import { ApiProperty } from '@nestjs/swagger';

export class ArReceiptMethodDto {
  @ApiProperty({
    description: 'Receipt classes',
    example: 'Tunai',
  })
  RECEIPT_CLASSES: string;

  @ApiProperty({
    description: 'Printed name',
    example: 'KAS CABANG-Tunai',
  })
  PRINTED_NAME: string;

  @ApiProperty({
    description: 'Receipt method name',
    example: 'KAS CABANG-Tunai',
  })
  RECEIPT_METHOD_NAME: string;

  @ApiProperty({
    description: 'Receipt method ID',
    example: 3044,
  })
  RECEIPT_METHOD_ID: number;

  @ApiProperty({
    description: 'Bank name',
    example: 'KAS',
    required: false,
  })
  BANK_NAME?: string;

  @ApiProperty({
    description: 'Bank branch name',
    example: 'Internal',
    required: false,
  })
  BANK_BRANCH_NAME?: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '111100003-201211',
    required: false,
  })
  BANK_ACCOUNT_NUMBER?: string;

  @ApiProperty({
    description: 'Bank account name',
    example: '201211 KAS BGR',
    required: false,
  })
  BANK_ACCOUNT_NAME?: string;

  @ApiProperty({
    description: 'Bank ID',
    example: 7042,
    required: false,
  })
  BANK_ID?: number;

  @ApiProperty({
    description: 'Bank branch ID',
    example: 7043,
    required: false,
  })
  BANK_BRANCH_ID?: number;

  @ApiProperty({
    description: 'Bank account ID',
    example: 15000,
    required: false,
  })
  BANK_ACCOUNT_ID?: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'IDR',
    required: false,
  })
  CURRENCY_CODE?: string;

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
    description: 'Sales flag',
    example: 'Y',
    required: false,
  })
  SALES_FLAG?: string;

  @ApiProperty({
    description: 'Collection flag',
    example: 'Y',
    required: false,
  })
  COLLECTION_FLAG?: string;

  @ApiProperty({
    description: 'Return flag',
    example: 'Y',
    required: false,
  })
  RETURN_FLAG?: string;

  @ApiProperty({
    description: 'Settle flag',
    example: 'Y',
    required: false,
  })
  SETTLE_FLAG?: string;

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
    description: 'Last update date',
    example: '2024-04-29 14:46:35.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;
}

export class ArReceiptMethodQueryDto {
  @ApiProperty({
    description: 'Receipt method name to filter by',
    example: 'KAS CABANG-Tunai',
    required: false,
  })
  receiptMethodName?: string;

  @ApiProperty({
    description: 'Receipt classes to filter by',
    example: 'Tunai',
    required: false,
  })
  receiptClasses?: string;

  @ApiProperty({
    description: 'Organization code to filter by',
    example: 'BGR',
    required: false,
  })
  organizationCode?: string;

  @ApiProperty({
    description: 'Currency code to filter by',
    example: 'IDR',
    required: false,
  })
  currencyCode?: string;

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
