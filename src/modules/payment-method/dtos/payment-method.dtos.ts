import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodDto {
  @ApiProperty({
    description: 'Payment method code',
    example: 'Tunai',
  })
  PAYMENT_METHOD_CODE: string;

  @ApiProperty({
    description: 'Payment method name',
    example: 'Tunai',
  })
  PAYMENT_METHOD_NAME: string;

  @ApiProperty({
    description: 'Description',
    example: 'Pembayaran menggunakan tunai',
    required: false,
  })
  DESCRIPTION?: string;

  @ApiProperty({
    description: 'Bank account name',
    example: 'KAS SALESMAN',
    required: false,
  })
  BANK_ACCOUNT_NAME?: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '111100005',
    required: false,
  })
  BANK_ACCOUNT_NUM?: string;

  @ApiProperty({
    description: 'Currency code',
    example: 'IDR',
    required: false,
  })
  CURRENCY_CODE?: string;

  @ApiProperty({
    description: 'Multi currency allowed flag',
    example: 'N',
    required: false,
  })
  MULTI_CURRENCY_ALLOWED_FLAG?: string;

  @ApiProperty({
    description: 'Bank account ID',
    example: 12002,
    required: false,
  })
  BANK_ACCOUNT_ID?: number;

  @ApiProperty({
    description: 'Bank account use ID',
    example: 10231,
    required: false,
  })
  BANK_ACCT_USE_ID?: number;

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
    description: 'System profile code',
    example: 'XTD_AP_PAYMENT_PROCESS_PROFILE',
    required: false,
  })
  SYSTEM_PROFILE_CODE?: string;

  @ApiProperty({
    description: 'Payment profile name',
    example: 'XTD AP Payment Process Profile',
    required: false,
  })
  PAYMENT_PROFILE_NAME?: string;

  @ApiProperty({
    description: 'Payment profile ID',
    example: 181,
    required: false,
  })
  PAYMENT_PROFILE_ID?: number;

  @ApiProperty({
    description: 'Payment document name',
    example: 'KAS-SALESMAN-24',
    required: false,
  })
  PAYMENT_DOCUMENT_NAME?: string;

  @ApiProperty({
    description: 'Payment document ID',
    example: 301,
    required: false,
  })
  PAYMENT_DOCUMENT_ID?: number;

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
    example: '2024-01-06 18:48:24.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;
}

export class PaymentMethodQueryDto {
  @ApiProperty({
    description: 'Payment method name to filter by',
    example: 'Tunai',
    required: false,
  })
  paymentMethodName?: string;

  @ApiProperty({
    description: 'Payment method code to filter by',
    example: 'Tunai',
    required: false,
  })
  paymentMethodCode?: string;

  @ApiProperty({
    description: 'Currency code to filter by',
    example: 'IDR',
    required: false,
  })
  currencyCode?: string;

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
