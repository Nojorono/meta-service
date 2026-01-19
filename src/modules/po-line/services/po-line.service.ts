import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import { PoLineDto, PoLineQueryDto } from '../dtos/po-line.dtos';

@Injectable()
export class PoLineService {
  private readonly logger = new Logger(PoLineService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAllPoLines(
    queryDto: PoLineQueryDto,
  ): Promise<PoLineDto[]> {
    try {
      const {
        vendor_id,
        segment1,
        item_description,
        po_line_id,
        page = 1,
        limit = 10,
      } = queryDto;

      if (!vendor_id) {
        throw new Error('vendor_id is required');
      }

      let query = `
        SELECT 
          pha.segment1 as SEGMENT1,
          pla.item_description as ITEM_DESCRIPTION,
          pla.po_line_id as PO_LINE_ID
        FROM 
          APPS.po_lines_all pla,
          APPS.po_distributions_all pda,
          APPS.po_req_distributions_all prda,
          APPS.po_headers_all pha,
          APPS.po_requisition_lines_all prla,
          APPS.po_requisition_headers_all prha
        WHERE 
          pha.po_header_id = pda.po_header_id
          AND prda.distribution_id = pda.req_distribution_id
          AND pla.po_header_id = pha.po_header_id
          AND pla.po_line_id = pda.po_line_id
          AND prda.requisition_line_id = prla.Requisition_line_id
          AND prla.requisition_header_id = prha.requisition_header_id
          AND prha.attribute7 = 'YES'
          AND pla.attribute7 IS NULL
          AND pha.vendor_id = :1
          AND 0 = (
            SELECT NVL(SUM(plla.quantity_received), 0)
            FROM APPS.po_line_locations_all plla
            WHERE 1=1
              AND plla.po_line_id = pla.po_line_id
          )
      `;

      const params: any[] = [vendor_id];
      let paramIndex = 2;

      if (segment1) {
        query += ` AND UPPER(pha.segment1) LIKE UPPER(:${paramIndex})`;
        params.push(`%${segment1}%`);
        paramIndex++;
      }

      if (item_description) {
        query += ` AND UPPER(pla.item_description) LIKE UPPER(:${paramIndex})`;
        params.push(`%${item_description}%`);
        paramIndex++;
      }

      if (po_line_id) {
        query += ` AND pla.po_line_id = :${paramIndex}`;
        params.push(po_line_id);
        paramIndex++;
      }

      // Add pagination
      const offset = (page - 1) * limit;
      query += ` ORDER BY pha.segment1, pla.item_description OFFSET :${paramIndex} ROWS FETCH NEXT :${paramIndex + 1} ROWS ONLY`;
      params.push(offset, limit);

      const result = await this.oracleService.executeQuery(query, params);

      this.logger.log(`Found ${result.rows.length} PO lines for vendor_id: ${vendor_id}`);
      return result.rows as PoLineDto[];
    } catch (error) {
      this.logger.error('Error finding PO lines:', error);
      throw error;
    }
  }

  async findPoLineById(
    poLineId: number,
    vendorId: number,
  ): Promise<PoLineDto | null> {
    try {
      const query = `
        SELECT 
          pha.segment1 as SEGMENT1,
          pla.item_description as ITEM_DESCRIPTION,
          pla.po_line_id as PO_LINE_ID
        FROM 
          APPS.po_lines_all pla,
          APPS.po_distributions_all pda,
          APPS.po_req_distributions_all prda,
          APPS.po_headers_all pha,
          APPS.po_requisition_lines_all prla,
          APPS.po_requisition_headers_all prha
        WHERE 
          pha.po_header_id = pda.po_header_id
          AND prda.distribution_id = pda.req_distribution_id
          AND pla.po_header_id = pha.po_header_id
          AND pla.po_line_id = pda.po_line_id
          AND prda.requisition_line_id = prla.Requisition_line_id
          AND prla.requisition_header_id = prha.requisition_header_id
          AND prha.attribute7 = 'YES'
          AND pla.attribute7 IS NULL
          AND pha.vendor_id = :1
          AND pla.po_line_id = :2
          AND 0 = (
            SELECT NVL(SUM(plla.quantity_received), 0)
            FROM APPS.po_line_locations_all plla
            WHERE 1=1
              AND plla.po_line_id = pla.po_line_id
          )
      `;

      const result = await this.oracleService.executeQuery(query, [
        vendorId,
        poLineId,
      ]);

      if (result.rows.length === 0) {
        this.logger.warn(
          `PO line not found for ID: ${poLineId} and vendor_id: ${vendorId}`,
        );
        return null;
      }

      this.logger.log(`Found PO line: ${poLineId}`);
      return result.rows[0] as PoLineDto;
    } catch (error) {
      this.logger.error(
        `Error finding PO line by ID ${poLineId}:`,
        error,
      );
      throw error;
    }
  }

  async getPoLineCount(queryDto: PoLineQueryDto): Promise<number> {
    try {
      const { vendor_id, segment1, item_description, po_line_id } = queryDto;

      if (!vendor_id) {
        throw new Error('vendor_id is required');
      }

      let query = `
        SELECT COUNT(*) as TOTAL_COUNT
        FROM 
          APPS.po_lines_all pla,
          APPS.po_distributions_all pda,
          APPS.po_req_distributions_all prda,
          APPS.po_headers_all pha,
          APPS.po_requisition_lines_all prla,
          APPS.po_requisition_headers_all prha
        WHERE 
          pha.po_header_id = pda.po_header_id
          AND prda.distribution_id = pda.req_distribution_id
          AND pla.po_header_id = pha.po_header_id
          AND pla.po_line_id = pda.po_line_id
          AND prda.requisition_line_id = prla.Requisition_line_id
          AND prla.requisition_header_id = prha.requisition_header_id
          AND prha.attribute7 = 'YES'
          AND pla.attribute7 IS NULL
          AND pha.vendor_id = :1
          AND 0 = (
            SELECT NVL(SUM(plla.quantity_received), 0)
            FROM APPS.po_line_locations_all plla
            WHERE 1=1
              AND plla.po_line_id = pla.po_line_id
          )
      `;

      const params: any[] = [vendor_id];
      let paramIndex = 2;

      if (segment1) {
        query += ` AND UPPER(pha.segment1) LIKE UPPER(:${paramIndex})`;
        params.push(`%${segment1}%`);
        paramIndex++;
      }

      if (item_description) {
        query += ` AND UPPER(pla.item_description) LIKE UPPER(:${paramIndex})`;
        params.push(`%${item_description}%`);
        paramIndex++;
      }

      if (po_line_id) {
        query += ` AND pla.po_line_id = :${paramIndex}`;
        params.push(po_line_id);
        paramIndex++;
      }

      const result = await this.oracleService.executeQuery(query, params);
      const count = result.rows[0]?.TOTAL_COUNT || 0;

      this.logger.log(`Total PO line count: ${count}`);
      return count;
    } catch (error) {
      this.logger.error('Error getting PO line count:', error);
      throw error;
    }
  }
}
