export class MetaRegionDto {
  region_code: string;
  region_name: string;
  last_update_date: string;
}

export class MetaRegionDtoByDate {
  last_update_date: string;
}

export class MetaRegionResponseDto {
  data: MetaRegionDto[];
  count: number;
  message?: string;
  status?: boolean;
}
