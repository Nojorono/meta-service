export class MetaSalesmanDto {
  [key: string]: any;
}

export class MetaSalesmanDtoByDate {
  last_update_date: string;
}

export class MetaSalesmanDtoBySalesrepNumber {
  salesrep_number: string;
}

export class MetaSalesmanResponseDto {
  data: any[];
  count: number;
  message?: string;
  status?: boolean;
}
