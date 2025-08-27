export class MetaUomListDto {
  UNIT_OF_MEASURE: string;
  UOM_CODE: string;
}

export class MetaUomListDtoByUomCode {
  UOM_CODE: string;
}

export class UomListQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  UOM_CODE?: string;
}

export class MetaUomListResponseDto {
  data: MetaUomListDto[];
  count: number;
  message?: string;
  status?: boolean;
}
