import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class MetaCustomerDto {
  @ApiPropertyOptional({ description: 'Customer address line 1' })
  @IsString()
  @IsOptional()
  address1?: string;

  @IsString()
  @IsOptional()
  bill_to_location?: string;

  @IsNumber()
  @IsOptional()
  bill_to_site_use_id?: number;

  @IsString()
  @IsOptional()
  channel?: string;

  @IsString()
  @IsOptional()
  credit_checking?: string;

  @IsNumber()
  @IsOptional()
  credit_exposure?: number;

  @IsNumber()
  @IsOptional()
  cust_account_id?: number;

  @ApiProperty({ description: 'Customer name', example: 'PT. ABCD Indonesia' })
  @IsString()
  customer_name: string;

  @IsString()
  @IsOptional()
  customer_number?: string;

  @IsString()
  @IsOptional()
  kab_kodya?: string;

  @IsString()
  @IsOptional()
  kecamatan?: string;

  @IsString()
  @IsOptional()
  kelurahan?: string;

  @IsString()
  @IsOptional()
  last_update_date?: string;

  @IsString()
  @IsOptional()
  order_type_id?: string;

  @IsString()
  @IsOptional()
  order_type_name?: string;

  @IsString()
  @IsOptional()
  org_id?: string;

  @IsString()
  @IsOptional()
  org_name?: string;

  @IsString()
  @IsOptional()
  organization_code?: string;

  @IsNumber()
  @IsOptional()
  organization_id?: number;

  @IsString()
  @IsOptional()
  organization_name?: string;

  @IsNumber()
  @IsOptional()
  overall_credit_limit?: number;

  @IsNumber()
  @IsOptional()
  price_list_id?: number;

  @IsString()
  @IsOptional()
  price_list_name?: string;

  @IsString()
  @IsOptional()
  provinsi?: string;

  @IsString()
  @IsOptional()
  return_order_type_id?: string;

  @IsString()
  @IsOptional()
  return_order_type_name?: string;

  @IsString()
  @IsOptional()
  ship_to_location?: string;

  @IsNumber()
  @IsOptional()
  ship_to_site_use_id?: number;

  @IsString()
  @IsOptional()
  site_type?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  term_day?: number;

  @IsNumber()
  @IsOptional()
  term_id?: number;

  @IsString()
  @IsOptional()
  term_name?: string;

  @IsNumber()
  @IsOptional()
  trx_credit_limit?: number;
}

export class MetaCustomerDtoByDate {
  @ApiProperty({
    description: 'Last update date filter',
    example: '2024-01-15',
  })
  @Type(() => String)
  @IsString()
  last_update_date: string; // 2024-05-22 18:10:01
}

export class PaginationParamsDto {
  @ApiPropertyOptional({ description: 'Page number', type: Number, example: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', type: Number, example: 10 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @ApiPropertyOptional({ description: 'Search term', type: String, example: 'PT. ABCD' })
  @IsString()
  @IsOptional()
  @Type(() => String)
  search?: string;
}

export class MetaCustomerResponseDto {
  @ApiProperty({
    description: 'Array of customer data',
    type: [MetaCustomerDto],
  })
  data: MetaCustomerDto[];

  @ApiProperty({ description: 'Total count of customers', example: 100 })
  count: number;

  @ApiPropertyOptional({
    description: 'Total pages for pagination',
    example: 10,
  })
  totalPages?: number;

  @ApiPropertyOptional({ description: 'Current page number', example: 1 })
  currentPage?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  limit?: number;

  @ApiPropertyOptional({
    description: 'Response message',
    example: 'Customer data retrieved successfully',
  })
  message?: string;

  @ApiPropertyOptional({ description: 'Response status', example: true })
  status?: boolean;
}
