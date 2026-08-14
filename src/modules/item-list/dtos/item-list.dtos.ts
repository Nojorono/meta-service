export class MetaItemListDto {
  item_code?: string;
  item_number?: string;
  item_description?: string;
  inventory_item_id?: number;
  organization_code?: string;
  principle?: string;
  status_code?: string;
  urut?: number;
  dus_bal?: number;
  bal_prs?: number;
  prs_bks?: number;
  bks_btg?: number;
}

export class MetaItemListDtoByItemCode {
  item_code?: string;
}

export class MetaItemListDtoByInventoryItemId {
  inventory_item_id?: number;
  organization_code?: string;
}

export class ItemListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  item_code?: string;
}

export class MetaItemListResponseDto {
  data?: MetaItemListDto[];
  count?: number;
  message: string;
  status: boolean;
}
