export class MetaTruckUtilDto {
  ITEM: string;
  ITEM_DESCRIPTION: string;
}

export class MetaTruckUtilDtoByItem {
  ITEM: string;
}

export class TruckUtilQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  ITEM?: string;
}

export class MetaTruckUtilResponseDto {
  data: MetaTruckUtilDto[];
  count: number;
  message?: string;
  status?: boolean;
}
