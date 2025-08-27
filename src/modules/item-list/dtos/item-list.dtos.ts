export class MetaItemListDto {
  item_code: string;
  item_number: string;
  item_description: string;
  inventory_item_id: number;
}

export class MetaItemListDtoByItemCode {
  item_code: string;
}

export class ItemListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  item_code?: string;
}

export class MetaItemListResponseDto {
  data: MetaItemListDto[];
  count: number;
  message?: string;
  status?: boolean;
}
