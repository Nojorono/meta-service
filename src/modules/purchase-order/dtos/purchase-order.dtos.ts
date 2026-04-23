export class PurchaseOrderDto {
  NOMOR_PO: string;
  ID_VENDOR: number;
  VENDOR_SITE_ID: number;
  NAMA_VENDOR: string;
  ALAMAT_VENDOR: string;
  PRIN_GROUP: string;
  TANGGAL_PEMBUATAN_PO: string;
  STATUS_PO: string;
  TANGGAL_APPROVE_PO: string;
  PO_LINE_NUM: number;
  SKU: string;
  KODE_ITEM: string;
  DESKRIPSI_ITEM_LINE_PO: string;
  PO_LINE_QUANTITY: string;
  QTY_RECEIVED: number;
  QTY_DUE: number;
  UOM: string;
  KONDISI_PO: string;
}

export class PurchaseOrderResponseDto {
  data: PurchaseOrderDto[];
  count: number;
  status: boolean;
  message: string;
}
