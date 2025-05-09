export class SalesmanMetaDto {
  salesrep_number: string;
  salesrep_name: string;
  employee_name: string;
  supervisor_number?: string;
  salesrep_id: number;
  sales_credit_type_id?: number;
  subinventory_code?: string;
  locator_id?: number;
  vendor_name?: string;
  vendor_num?: string;
  vendor_site_code?: string;
  vendor_id?: number;
  vendor_site_id?: number;
  organization_code: string;
  organization_name: string;
  organization_id: number;
  org_name: string;
  org_id: number;
  status?: string;
  start_date_active?: Date;
  end_date_active?: Date;
}

export class SalesmanMetaDtoBySalesrepNumber {
  salesrep_number: string;
}

export class SalesmanMetaDtoByDate {
  last_update_date: string;
}

export class SalesmanMetaResponseDto {
  data: SalesmanMetaDto[];
  count: number;
  status: boolean;
  message: string;
}
