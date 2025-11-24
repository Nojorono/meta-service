import { ApiProperty } from '@nestjs/swagger';

export class ArCustomersSdDto {
  @ApiProperty({
    description: 'Address Line 1',
    example: 'Jl. Sudirman No. 123',
    required: false,
  })
  ADDRESS1?: string;

  @ApiProperty({
    description: 'Bill To Location',
    example: 'Jakarta Office',
    required: false,
  })
  BILL_TO_LOCATION?: string;

  @ApiProperty({
    description: 'Bill To Site Use ID',
    example: 1001,
    required: false,
  })
  BILL_TO_SITE_USE_ID?: number;

  @ApiProperty({
    description: 'Channel',
    example: 'RETAIL',
    required: false,
  })
  CHANNEL?: string;

  @ApiProperty({
    description: 'Credit Checking',
    example: 'Y',
    required: false,
  })
  CREDIT_CHECKING?: string;

  @ApiProperty({
    description: 'Customer Account ID',
    example: 5001,
  })
  CUST_ACCOUNT_ID: number;

  @ApiProperty({
    description: 'Customer Name',
    example: 'PT ABC Indonesia',
  })
  CUSTOMER_NAME: string;

  @ApiProperty({
    description: 'Customer Number',
    example: 'CUST-001',
  })
  CUSTOMER_NUMBER: string;

  @ApiProperty({
    description: 'Kabupaten/Kota',
    example: 'Jakarta Selatan',
    required: false,
  })
  KAB_KODYA?: string;

  @ApiProperty({
    description: 'Kecamatan',
    example: 'Kebayoran Baru',
    required: false,
  })
  KECAMATAN?: string;

  @ApiProperty({
    description: 'Kelurahan',
    example: 'Senayan',
    required: false,
  })
  KELURAHAN?: string;

  @ApiProperty({
    description: 'Last Update Date',
    example: '2024-01-15',
    required: false,
  })
  LAST_UPDATE_DATE?: string;

  @ApiProperty({
    description: 'Order Type ID',
    example: 'OT001',
    required: false,
  })
  ORDER_TYPE_ID?: string;

  @ApiProperty({
    description: 'Order Type Name',
    example: 'Standard Order',
    required: false,
  })
  ORDER_TYPE_NAME?: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 201,
    required: false,
  })
  ORG_ID?: number;

  @ApiProperty({
    description: 'Overall Credit Limit',
    example: 1000000,
    required: false,
  })
  OVERALL_CREDIT_LIMIT?: number;

  @ApiProperty({
    description: 'Price List ID',
    example: 301,
    required: false,
  })
  PRICE_LIST_ID?: number;

  @ApiProperty({
    description: 'Price List Name',
    example: 'Standard Price List',
    required: false,
  })
  PRICE_LIST_NAME?: string;

  @ApiProperty({
    description: 'Provinsi',
    example: 'DKI Jakarta',
    required: false,
  })
  PROVINSI?: string;

  @ApiProperty({
    description: 'Return Order Type ID',
    example: 'RT001',
    required: false,
  })
  RETURN_ORDER_TYPE_ID?: string;

  @ApiProperty({
    description: 'Return Order Type Name',
    example: 'Standard Return',
    required: false,
  })
  RETURN_ORDER_TYPE_NAME?: string;

  @ApiProperty({
    description: 'Ship To Location',
    example: 'Jakarta Warehouse',
    required: false,
  })
  SHIP_TO_LOCATION?: string;

  @ApiProperty({
    description: 'Ship To Site Use ID',
    example: 2001,
    required: false,
  })
  SHIP_TO_SITE_USE_ID?: number;

  @ApiProperty({
    description: 'Site Type',
    example: 'BILL_TO',
    required: false,
  })
  SITE_TYPE?: string;

  @ApiProperty({
    description: 'Status',
    example: 'A',
    required: false,
  })
  STATUS?: string;

  @ApiProperty({
    description: 'Term Day',
    example: 30,
    required: false,
  })
  TERM_DAY?: number;

  @ApiProperty({
    description: 'Term ID',
    example: 401,
    required: false,
  })
  TERM_ID?: number;

  @ApiProperty({
    description: 'Term Name',
    example: 'NET 30',
    required: false,
  })
  TERM_NAME?: string;

  @ApiProperty({
    description: 'Transaction Credit Limit',
    example: 500000,
    required: false,
  })
  TRX_CREDIT_LIMIT?: number;
}

export class ArCustomersSdQueryDto {
  @ApiProperty({
    description: 'Customer Number to filter by',
    example: 'CUST-001',
    required: false,
  })
  customerNumber?: string;

  @ApiProperty({
    description: 'Customer Name to filter by',
    example: 'PT ABC',
    required: false,
  })
  customerName?: string;

  @ApiProperty({
    description: 'Customer Account ID to filter by',
    example: 5001,
    required: false,
  })
  custAccountId?: number;

  @ApiProperty({
    description: 'Organization ID to filter by',
    example: 201,
    required: false,
  })
  orgId?: number;

  @ApiProperty({
    description: 'Status to filter by',
    example: 'A',
    required: false,
  })
  status?: string;

  @ApiProperty({
    description: 'Channel to filter by',
    example: 'RETAIL',
    required: false,
  })
  channel?: string;

  @ApiProperty({
    description: 'Provinsi to filter by',
    example: 'DKI Jakarta',
    required: false,
  })
  provinsi?: string;

  @ApiProperty({
    description: 'Kab/Kodya to filter by',
    example: 'Jakarta Selatan',
    required: false,
  })
  kabKodya?: string;

  @ApiProperty({
    description: 'Kecamatan to filter by',
    example: 'Kebayoran Baru',
    required: false,
  })
  kecamatan?: string;

  @ApiProperty({
    description: 'Site Type to filter by',
    example: 'BILL_TO',
    required: false,
  })
  siteType?: string;

  @ApiProperty({
    description: 'Price List ID to filter by',
    example: 301,
    required: false,
  })
  priceListId?: number;
}

