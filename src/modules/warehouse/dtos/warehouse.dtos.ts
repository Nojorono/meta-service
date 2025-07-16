export class MetaWarehouseDto {
  subinventory_code: string;
  locator_code: string;
  locator_id: number;
  locator_category?: string;
  warehouse_dms?: string;
  organization_code: string;
  organization_name: string;
  organization_id: number;
  org_name?: string;
  org_id?: string;
  last_update_date: string;
}

export class MetaWarehouseDtoByDate {
  last_update_date: string;
}

export class MetaWarehouseDtoByOrganizationCode {
  organization_code: string;
}

export class MetaWarehouseResponseDto {
  data: MetaWarehouseDto[];
  count: number;
  message?: string;
  status?: boolean;
}
