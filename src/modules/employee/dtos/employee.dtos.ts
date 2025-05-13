export class EmployeeMetaDto {
  employee_number: string;
  employee_name: string;
  flag_salesman?: string;
  supervisor_number?: string;
  vendor_name?: string;
  vendor_num?: string;
  vendor_site_code?: string;
  vendor_id?: number;
  vendor_site_id?: number;
  effective_start_date?: Date;
  effective_end_date?: Date;
  organization_code: string;
  organization_name: string;
  organization_id: number;
  org_name: string;
  org_id: number;
}

export class EmployeeMetaDtoByEmployeeNumber {
  employee_number: string;
}

export class EmployeeMetaDtoByDate {
  last_update_date: string;
}

export class EmployeeMetaResponseDto {
  data: EmployeeMetaDto[];
  count: number;
  status: boolean;
  message: string;
}
