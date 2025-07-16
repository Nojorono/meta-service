import { ApiProperty } from '@nestjs/swagger';

export class SalesItemConversionDto {
  @ApiProperty({
    description: 'Item code',
    example: 'KSN12',
  })
  ITEM_CODE: string;

  @ApiProperty({
    description: 'Item number',
    example: 'RK.KSN.120000',
  })
  ITEM_NUMBER: string;

  @ApiProperty({
    description: 'Item description',
    example: 'Kapal Sakti Regular Merah',
  })
  ITEM_DESCRIPTION: string;

  @ApiProperty({
    description: 'Inventory item ID',
    example: 233001,
  })
  INVENTORY_ITEM_ID: number;

  @ApiProperty({
    description: 'Source UOM code',
    example: 'BAL',
  })
  SOURCE_UOM_CODE: string;

  @ApiProperty({
    description: 'Source UOM',
    example: 'Bal',
  })
  SOURCE_UOM: string;

  @ApiProperty({
    description: 'Base UOM code',
    example: 'BKS',
  })
  BASE_UOM_CODE: string;

  @ApiProperty({
    description: 'Base UOM',
    example: 'Bungkus',
  })
  BASE_UOM: string;

  @ApiProperty({
    description: 'Conversion rate',
    example: 200,
  })
  CONVERSION_RATE: number;

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
    example: '2025-04-15 16:31:11.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;
}

export class SalesItemConversionQueryDto {
  @ApiProperty({
    description: 'Item code to filter by',
    example: 'KSN12',
    required: false,
  })
  itemCode?: string;

  @ApiProperty({
    description: 'Item number to filter by',
    example: 'RK.KSN.120000',
    required: false,
  })
  itemNumber?: string;

  @ApiProperty({
    description: 'Item description to filter by',
    example: 'Kapal Sakti Regular Merah',
    required: false,
  })
  itemDescription?: string;

  @ApiProperty({
    description: 'Source UOM code to filter by',
    example: 'BAL',
    required: false,
  })
  sourceUomCode?: string;

  @ApiProperty({
    description: 'Base UOM code to filter by',
    example: 'BKS',
    required: false,
  })
  baseUomCode?: string;

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
