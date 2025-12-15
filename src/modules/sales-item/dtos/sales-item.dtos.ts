export class MetaSalesItemDto {
  item_id: number;
  item_code: string;
  item_name: string;
  organization_id: number;
  organization_code: string;
  primary_unit_of_measure: string;
  item_type: string;
  planning_make_buy_code: string;
  is_active: string;
  last_update_date: string;
}

export class MetaSalesItemDtoByDate {
  last_update_date: string;
}

export class MetaSalesItemDtoByBranch {
  branch: string;
}

export class MetaSalesItemResponseDto {
  data: MetaSalesItemDto[];
  count: number;
  message?: string;
  status?: boolean;
}
