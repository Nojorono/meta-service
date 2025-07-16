export class MetaSalesmanDto {
  salesrep_id: number;
  salesrep_number: string;
  salesrep_name: string;
  organization_id: number;
  organization_code: string;
  is_active: string;
  last_update_date: string;
}

export class MetaSalesmanDtoByDate {
  last_update_date: string;
}

export class MetaSalesmanResponseDto {
  data: MetaSalesmanDto[];
  count: number;
  message?: string;
  status?: boolean;
}
