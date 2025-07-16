import { ApiProperty } from '@nestjs/swagger';

export class PriceListDto {
  @ApiProperty({
    description: 'Price name',
    example: 'PL - RRO Nasional / SPO',
  })
  PRICE_NAME: string;

  @ApiProperty({
    description: 'Item code',
    example: '25_AST16',
  })
  ITEM_CODE: string;

  @ApiProperty({
    description: 'Item description',
    example: '25_AROMA ROYAL TEA 16',
  })
  ITEM_DESCRIPTION: string;

  @ApiProperty({
    description: 'Product UOM code',
    example: 'BAL',
  })
  PRODUCT_UOM_CODE: string;

  @ApiProperty({
    description: 'List price',
    example: 1330000,
  })
  LIST_PRICE: number;

  @ApiProperty({
    description: 'Start date active',
    example: '2024-06-24 00:00:00.000',
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
    description: 'Price list ID',
    example: 7010,
  })
  PRICE_LIST_ID: number;

  @ApiProperty({
    description: 'Price list line ID',
    example: 73386,
  })
  PRICE_LIST_LINE_ID: number;

  @ApiProperty({
    description: 'Customer name',
    example: 'PT. CUSTOMER ABC',
    required: false,
  })
  CUSTOMER_NAME?: string;

  @ApiProperty({
    description: 'Customer number',
    example: 'CUST001',
    required: false,
  })
  CUSTOMER_NUMBER?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-12-05 16:12:13.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;

  @ApiProperty({
    description: 'Site use code',
    example: 'BILL_TO',
    required: false,
  })
  SITE_USE_CODE?: string;

  @ApiProperty({
    description: 'Location',
    example: 'JAKARTA',
    required: false,
  })
  LOCATION?: string;

  @ApiProperty({
    description: 'Customer account ID',
    example: 12345,
    required: false,
  })
  CUST_ACCOUNT_ID?: number;

  @ApiProperty({
    description: 'Site use ID',
    example: 67890,
    required: false,
  })
  SITE_USE_ID?: number;
}

export class PriceListQueryDto {
  @ApiProperty({
    description: 'Price name to filter by',
    example: 'PL - RRO Nasional / SPO',
    required: false,
  })
  priceName?: string;

  @ApiProperty({
    description: 'Item code to filter by',
    example: '25_AST16',
    required: false,
  })
  itemCode?: string;

  @ApiProperty({
    description: 'Item description to filter by',
    example: '25_AROMA ROYAL TEA 16',
    required: false,
  })
  itemDescription?: string;

  @ApiProperty({
    description: 'Product UOM code to filter by',
    example: 'BAL',
    required: false,
  })
  productUomCode?: string;

  @ApiProperty({
    description: 'Customer number to filter by',
    example: 'CUST001',
    required: false,
  })
  customerNumber?: string;

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
