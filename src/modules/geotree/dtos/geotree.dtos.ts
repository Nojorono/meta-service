export class MetaGeoTreeDto {
  kecamatan: string;
  kecamatan_code: string;
  kelurahan: string;
  kelurahan_code: string;
  kotamadya: string;
  kotamadya_code: string;
  provinsi: string;
  provinsi_code: string;
  last_update_date: string;
}

export class MetaGeoTreeDtoByDate {
  last_update_date: string;
}

export class MetaGeoTreeResponseDto {
  data: MetaGeoTreeDto[];
  count: number;
  message?: string;
  status?: boolean;
}
