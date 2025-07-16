import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { PurchaseOrderDto } from '../dtos/purchase-order.dtos';

@Injectable()
export class PurchaseOrderService {
  private readonly logger = new Logger(PurchaseOrderService.name);
  constructor(private readonly oracleService: OracleService) {}

  async findByNomorPO(nomorPO: string): Promise<PurchaseOrderDto[]> {
    const sql = `
      SELECT DISTINCT
        PHA.SEGMENT1 AS NOMOR_PO,
        (SELECT VENDOR_ID FROM AP_SUPPLIERS WHERE VENDOR_ID = PHA.VENDOR_ID) AS ID_VENDOR,
        (SELECT VENDOR_NAME FROM AP_SUPPLIERS WHERE VENDOR_ID = PHA.VENDOR_ID) AS NAMA_VENDOR,
        (SELECT ADDRESS_LINE1 FROM AP_SUPPLIER_SITES_ALL WHERE VENDOR_SITE_ID = PHA.VENDOR_SITE_ID) AS ALAMAT_VENDOR,
        (SELECT PRIN_GROUP FROM XTD_AP_SUPP_PRIN_ROKOK_V WHERE VENDOR_ID = PHA.VENDOR_ID) AS PRIN_GROUP,
        TO_CHAR(PHA.CREATION_DATE, 'DD-MON-RRRR') AS TANGGAL_PEMBUATAN_PO,
        PHA.AUTHORIZATION_STATUS AS STATUS_PO,
        TO_CHAR(PHA.APPROVED_DATE, 'DD-MON-RRRR') AS TANGGAL_APPROVE_PO,
        PLA.LINE_NUM AS PO_LINE_NUM,
        XISI.ITEM_CODE AS SKU,
        MSIB.SEGMENT1 || '.' || MSIB.SEGMENT2 || '.' || MSIB.SEGMENT3 AS KODE_ITEM,
        PLA.ITEM_DESCRIPTION AS DESKRIPSI_ITEM_LINE_PO,
        CASE
          WHEN TO_CHAR(PLA.QUANTITY) > 0 AND TO_CHAR(PLA.QUANTITY) < 1 THEN
            LTRIM(TO_CHAR(PLA.QUANTITY, '999999999999999990.99999999999999', 'NLS_NUMERIC_CHARACTERS = '',. '' '))
          WHEN TO_CHAR(PLA.QUANTITY) >= 1 THEN
            TO_CHAR(PLA.QUANTITY)
        END AS PO_LINE_QUANTITY,
        PLA.UNIT_MEAS_LOOKUP_CODE AS UOM,
        PLA.CLOSED_CODE AS KONDISI_PO
      FROM PO_HEADERS_ALL PHA,
           PO_LINES_ALL PLA,
           MTL_SYSTEM_ITEMS_B MSIB,
           XTD_INV_SALES_ITEMS_V XISI
      WHERE PHA.PO_HEADER_ID = PLA.PO_HEADER_ID
        AND MSIB.INVENTORY_ITEM_ID(+) = PLA.ITEM_ID
        AND XISI.ITEM_NUMBER = (MSIB.SEGMENT1 || '.' || MSIB.SEGMENT2 || '.' || MSIB.SEGMENT3)
        AND MSIB.SEGMENT1 IN ('RK')
        AND PHA.SEGMENT1 IN (:1)
      ORDER BY NOMOR_PO, PO_LINE_NUM ASC
    `;
    const params = [nomorPO];
    const result = await this.oracleService.executeQuery(sql, params);

    // Parsing hasil query
    const poData: Record<string, any> = {};
    if (result && Array.isArray(result.rows)) {
      for (const row of result.rows) {
        const {
          NOMOR_PO,
          ID_VENDOR,
          NAMA_VENDOR,
          ALAMAT_VENDOR,
          PRIN_GROUP,
          TANGGAL_PEMBUATAN_PO,
          STATUS_PO,
          TANGGAL_APPROVE_PO,
          PO_LINE_NUM,
          SKU,
          KODE_ITEM,
          DESKRIPSI_ITEM_LINE_PO,
          PO_LINE_QUANTITY,
          UOM,
          KONDISI_PO,
        } = row;

        if (!poData[NOMOR_PO]) {
          poData[NOMOR_PO] = {
            NOMOR_PO,
            ID_VENDOR,
            NAMA_VENDOR,
            ALAMAT_VENDOR,
            PRIN_GROUP,
            TANGGAL_PEMBUATAN_PO,
            STATUS_PO,
            TANGGAL_APPROVE_PO,
            ITEM: [],
          };
        }

        poData[NOMOR_PO].ITEM.push({
          PO_LINE_NUM,
          SKU,
          KODE_ITEM,
          DESKRIPSI_ITEM_LINE_PO,
          PO_LINE_QUANTITY,
          UOM,
          STATUS: KONDISI_PO,
        });
      }
    } else {
      this.logger.error('No rows returned from Oracle query or result is undefined.');
      throw new Error('Failed to retrieve Purchase Order');
    }

    return Object.values(poData);
  }
}
