import { IsNumber, IsOptional, IsString } from 'class-validator';

export class MetaCustomerDto {
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
  last_update_date: string; // 2024-05-22 18:10:01
}

export class PaginationParamsDto {
  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsString()
  @IsOptional()
  search?: string;
}

export class MetaCustomerResponseDto {
  data: MetaCustomerDto[];
  count: number;
  totalPages?: number;
  currentPage?: number;
  limit?: number;
  message?: string;
  status?: boolean;
}
