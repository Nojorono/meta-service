import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class SupplierDto {
  @ApiProperty({
    description: 'Vendor ID',
    example: 1001,
  })
  @IsOptional()
  @IsNumber()
  VENDOR_ID?: number;

  @ApiProperty({
    description: 'Vendor name',
    example: 'PT. Supplier Indonesia',
  })
  @IsOptional()
  @IsString()
  VENDOR_NAME?: string;

  @ApiProperty({
    description: 'Vendor name alternative',
    example: 'Supplier Indonesia',
  })
  @IsOptional()
  @IsString()
  VENDOR_NAME_ALT?: string;

  @ApiProperty({
    description: 'Summary flag',
    example: 'Y',
  })
  @IsOptional()
  @IsString()
  SUMMARY_FLAG?: string;

  @ApiProperty({
    description: 'Enabled flag',
    example: 'Y',
  })
  @IsOptional()
  @IsString()
  ENABLED_FLAG?: string;

  @ApiProperty({
    description: 'Last update login',
    example: 12345,
  })
  @IsOptional()
  @IsNumber()
  LAST_UPDATE_LOGIN?: number;

  @ApiProperty({
    description: 'Vendor type lookup code',
    example: 'VENDOR',
  })
  @IsOptional()
  @IsString()
  VENDOR_TYPE_LOOKUP_CODE?: string;

  @ApiProperty({
    description: 'One time flag',
    example: 'N',
  })
  @IsOptional()
  @IsString()
  ONE_TIME_FLAG?: string;

  @ApiProperty({
    description: 'VAT code',
    example: 'VAT01',
  })
  @IsOptional()
  @IsString()
  VAT_CODE?: string;

  @ApiProperty({
    description: 'Terms date basis',
    example: 'GOODS_RECEIVED',
  })
  @IsOptional()
  @IsString()
  TERMS_DATE_BASIS?: string;

  @ApiProperty({
    description: 'Attribute 5',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE5?: string;

  @ApiProperty({
    description: 'Attribute 6',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE6?: string;

  @ApiProperty({
    description: 'Attribute 7',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE7?: string;

  @ApiProperty({
    description: 'Attribute 8',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE8?: string;

  @ApiProperty({
    description: 'Attribute 9',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE9?: string;

  @ApiProperty({
    description: 'Attribute 10',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE10?: string;

  @ApiProperty({
    description: 'Attribute 11',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE11?: string;

  @ApiProperty({
    description: 'Attribute 12',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE12?: string;

  @ApiProperty({
    description: 'Attribute 13',
    example: '',
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE13?: string;

  @ApiProperty({
    description: 'VAT registration number',
    example: '123456789012345',
  })
  @IsOptional()
  @IsString()
  VAT_REGISTRATION_NUM?: string;

  @ApiProperty({
    description: 'Party ID',
    example: 5001,
  })
  @IsOptional()
  @IsNumber()
  PARTY_ID?: number;
}

export class SupplierQueryDto {
  @ApiProperty({
    description: 'Vendor ID to filter by',
    example: 1001,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  VENDOR_ID?: number;

  @ApiProperty({
    description: 'Vendor name to filter by',
    example: 'Supplier',
    required: false,
  })
  @IsOptional()
  @IsString()
  VENDOR_NAME?: string;

  @ApiProperty({
    description: 'Vendor type lookup code to filter by',
    example: 'VENDOR',
    required: false,
  })
  @IsOptional()
  @IsString()
  VENDOR_TYPE_LOOKUP_CODE?: string;

  @ApiProperty({
    description: 'Enabled flag to filter by',
    example: 'Y',
    required: false,
  })
  @IsOptional()
  @IsString()
  ENABLED_FLAG?: string;

  @ApiProperty({
    description: 'VAT code to filter by',
    example: 'VAT01',
    required: false,
  })
  @IsOptional()
  @IsString()
  VAT_CODE?: string;

  @ApiProperty({
    description: 'Attribute 7 to filter by',
    example: 'FREIGHT (FRG)',
    required: false,
  })
  @IsOptional()
  @IsString()
  ATTRIBUTE7?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
