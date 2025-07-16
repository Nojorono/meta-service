import { ApiProperty } from '@nestjs/swagger';

export class SupplierDto {
  @ApiProperty({
    description: 'Supplier ID',
    example: 1001,
  })
  SUPPLIER_ID: number;

  @ApiProperty({
    description: 'Supplier number',
    example: 'SUP001',
  })
  SUPPLIER_NUMBER: string;

  @ApiProperty({
    description: 'Supplier name',
    example: 'PT. Supplier Indonesia',
  })
  SUPPLIER_NAME: string;

  @ApiProperty({
    description: 'Supplier type',
    example: 'VENDOR',
  })
  SUPPLIER_TYPE: string;

  @ApiProperty({
    description: 'Supplier enabled flag',
    example: 'Y',
  })
  ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Supplier start date',
    example: '2020-01-01',
    required: false,
  })
  START_DATE?: string;

  @ApiProperty({
    description: 'Supplier end date',
    example: '2030-12-31',
    required: false,
  })
  END_DATE?: string;

  @ApiProperty({
    description: 'Supplier contact person',
    example: 'John Doe',
    required: false,
  })
  CONTACT_PERSON?: string;

  @ApiProperty({
    description: 'Supplier phone number',
    example: '+62-21-1234567',
    required: false,
  })
  PHONE_NUMBER?: string;

  @ApiProperty({
    description: 'Supplier email',
    example: 'contact@supplier.com',
    required: false,
  })
  EMAIL?: string;

  @ApiProperty({
    description: 'Supplier address',
    example: 'Jalan Supplier No. 123',
    required: false,
  })
  ADDRESS?: string;

  @ApiProperty({
    description: 'Supplier city',
    example: 'Jakarta',
    required: false,
  })
  CITY?: string;

  @ApiProperty({
    description: 'Supplier country',
    example: 'Indonesia',
    required: false,
  })
  COUNTRY?: string;

  @ApiProperty({
    description: 'Supplier tax number',
    example: '12.345.678.9-012.000',
    required: false,
  })
  TAX_NUMBER?: string;
}

export class SupplierQueryDto {
  @ApiProperty({
    description: 'Supplier number to filter by',
    example: 'SUP001',
    required: false,
  })
  supplierNumber?: string;

  @ApiProperty({
    description: 'Supplier name to filter by',
    example: 'Supplier',
    required: false,
  })
  supplierName?: string;

  @ApiProperty({
    description: 'Supplier type to filter by',
    example: 'VENDOR',
    required: false,
  })
  supplierType?: string;

  @ApiProperty({
    description: 'City to filter by',
    example: 'Jakarta',
    required: false,
  })
  city?: string;

  @ApiProperty({
    description: 'Country to filter by',
    example: 'Indonesia',
    required: false,
  })
  country?: string;

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
