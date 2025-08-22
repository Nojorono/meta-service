import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
    CreateApInvoiceHeaderDto,
    ApInvoiceHeaderResponseDto,
    CreateApInvoiceLineDto,
    ApInvoiceLineResponseDto,
    CreateApInvoiceWithLinesDto,
    ApInvoiceWithLinesResponseDto,
} from '../dtos/ap-invoice.dtos';

@Injectable()
export class ApInvoiceService {
    private readonly logger = new Logger(ApInvoiceService.name);

    constructor(private readonly oracleService: OracleService) { }

    async createApInvoiceHeader(
        createDto: CreateApInvoiceHeaderDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<ApInvoiceHeaderResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_AP_INVOICES_IFACE_V (
          INVOICE_TYPE_LOOKUP_CODE, INVOICE_DATE, VENDOR_ID, VENDOR_NUM, INVOICE_AMOUNT, INVOICE_NUM,
          VENDOR_NAME, VENDOR_SITE_ID, VENDOR_SITE_CODE, INVOICE_CURRENCY_CODE, TERMS_ID, TERMS_NAME,
          ATTRIBUTE_CATEGORY, ATTRIBUTE13, ATTRIBUTE14, SOURCE, INVOICE_RECEIVED_DATE, GL_DATE,
          PAYMENT_METHOD_CODE, ORG_NAME, ORG_ID, SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID,
          SOURCE_BATCH_ID, IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, TO_DATE(:2, 'YYYY-MM-DD'), :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15,
          :16, TO_DATE(:17, 'YYYY-MM-DD'), TO_DATE(:18, 'YYYY-MM-DD'), :19, :20, :21, :22, :23,
          :24, :25, 'READY', SYSDATE, :26, SYSDATE, :27
        )
      `;

            const binds = [
                createDto.INVOICE_TYPE_LOOKUP_CODE,              // 1
                createDto.INVOICE_DATE,                          // 2 - TO_DATE
                createDto.VENDOR_ID,                             // 3
                createDto.VENDOR_NUM,                            // 4
                createDto.INVOICE_AMOUNT,                        // 5
                createDto.INVOICE_NUM,                           // 6
                createDto.VENDOR_NAME,                           // 7
                createDto.VENDOR_SITE_ID,                        // 8
                createDto.VENDOR_SITE_CODE,                      // 9
                createDto.INVOICE_CURRENCY_CODE,                 // 10
                createDto.TERMS_ID,                              // 11
                createDto.TERMS_NAME,                            // 12
                createDto.ATTRIBUTE_CATEGORY,                    // 13
                createDto.ATTRIBUTE13 || null,                   // 14
                createDto.ATTRIBUTE14 || null,                   // 15
                createDto.SOURCE,                                // 16
                createDto.INVOICE_RECEIVED_DATE,                 // 17 - TO_DATE
                createDto.GL_DATE,                               // 18 - TO_DATE
                createDto.PAYMENT_METHOD_CODE,                   // 19
                createDto.ORG_NAME,                              // 20
                createDto.ORG_ID,                                // 21
                createDto.SOURCE_SYSTEM,                         // 22
                createDto.SOURCE_HEADER_ID,                      // 23
                createDto.SOURCE_LINE_ID,                        // 24
                createDto.SOURCE_BATCH_ID,                       // 25
                userId,                                          // 26 - CREATED_BY
                userId                                           // 27 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            const selectQuery = `
        SELECT HEADER_IFACE_ID, INVOICE_TYPE_LOOKUP_CODE, INVOICE_DATE, VENDOR_ID, VENDOR_NUM, INVOICE_AMOUNT, INVOICE_NUM,
               VENDOR_NAME, VENDOR_SITE_ID, VENDOR_SITE_CODE, INVOICE_CURRENCY_CODE, TERMS_ID, TERMS_NAME,
               ATTRIBUTE_CATEGORY, ATTRIBUTE13, ATTRIBUTE14, SOURCE, INVOICE_RECEIVED_DATE, GL_DATE,
               PAYMENT_METHOD_CODE, ORG_NAME, ORG_ID, SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID,
               SOURCE_BATCH_ID, IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_AP_INVOICES_IFACE_V
        WHERE SOURCE_HEADER_ID = :1 AND SOURCE_SYSTEM = :2
        ORDER BY CREATION_DATE DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [
                createDto.SOURCE_HEADER_ID,
                createDto.SOURCE_SYSTEM
            ]);

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created AP invoice header');
            }

            const createdRecord = result.rows[0];
            return {
                HEADER_IFACE_ID: createdRecord.HEADER_IFACE_ID,
                INVOICE_TYPE_LOOKUP_CODE: createdRecord.INVOICE_TYPE_LOOKUP_CODE,
                INVOICE_DATE: createdRecord.INVOICE_DATE,
                VENDOR_ID: createdRecord.VENDOR_ID,
                VENDOR_NUM: createdRecord.VENDOR_NUM,
                INVOICE_AMOUNT: createdRecord.INVOICE_AMOUNT,
                INVOICE_NUM: createdRecord.INVOICE_NUM,
                VENDOR_NAME: createdRecord.VENDOR_NAME,
                VENDOR_SITE_ID: createdRecord.VENDOR_SITE_ID,
                VENDOR_SITE_CODE: createdRecord.VENDOR_SITE_CODE,
                INVOICE_CURRENCY_CODE: createdRecord.INVOICE_CURRENCY_CODE,
                TERMS_ID: createdRecord.TERMS_ID,
                TERMS_NAME: createdRecord.TERMS_NAME,
                ATTRIBUTE_CATEGORY: createdRecord.ATTRIBUTE_CATEGORY,
                ATTRIBUTE13: createdRecord.ATTRIBUTE13 || '',
                ATTRIBUTE14: createdRecord.ATTRIBUTE14 || '',
                SOURCE: createdRecord.SOURCE,
                INVOICE_RECEIVED_DATE: createdRecord.INVOICE_RECEIVED_DATE,
                GL_DATE: createdRecord.GL_DATE,
                PAYMENT_METHOD_CODE: createdRecord.PAYMENT_METHOD_CODE,
                ORG_NAME: createdRecord.ORG_NAME,
                ORG_ID: createdRecord.ORG_ID,
                SOURCE_SYSTEM: createdRecord.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: createdRecord.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: createdRecord.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: createdRecord.SOURCE_BATCH_ID,
                IFACE_STATUS: createdRecord.IFACE_STATUS,
                CREATION_DATE: createdRecord.CREATION_DATE,
                CREATED_BY: createdRecord.CREATED_BY,
                LAST_UPDATE_DATE: createdRecord.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: createdRecord.LAST_UPDATED_BY
            };

        } catch (error) {
            this.logger.error('Error creating AP invoice header:', error);
            throw new Error(`Failed to create AP invoice header: ${error.message}`);
        }
    }

    async createApInvoiceLine(
        createDto: CreateApInvoiceLineDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<ApInvoiceLineResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_AP_INVOICE_LINES_IFACE_V (
          HEADER_IFACE_ID, DIST_CODE_CONCATENATED, DIST_CODE_COMBINATION_ID, ORG_NAME, ORG_ID, SOURCE_SYSTEM,
          SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID, CREATION_DATE, CREATED_BY,
          LAST_UPDATE_DATE, LAST_UPDATED_BY, LINE_NUMBER, LINE_TYPE_LOOKUP_CODE, AMOUNT,
          ACCOUNTING_DATE, TAX_CODE, DESCRIPTION, IFACE_STATUS
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, SYSDATE, :10, SYSDATE, :11, :12, :13, :14,
          TO_DATE(:15, 'YYYY-MM-DD'), :16, :17, 'READY'
        )
      `;

            const binds = [
                createDto.HEADER_IFACE_ID,                       // 1
                createDto.DIST_CODE_CONCATENATED,                // 2
                createDto.DIST_CODE_COMBINATION_ID,              // 3
                createDto.ORG_NAME,                              // 4
                createDto.ORG_ID,                                // 5
                createDto.SOURCE_SYSTEM,                         // 6
                createDto.SOURCE_HEADER_ID,                      // 7
                createDto.SOURCE_LINE_ID,                        // 8
                createDto.SOURCE_BATCH_ID,                       // 9
                userId,                                          // 10 - CREATED_BY
                userId,                                          // 11 - LAST_UPDATED_BY
                createDto.LINE_NUMBER,                           // 12
                createDto.LINE_TYPE_LOOKUP_CODE,                 // 13
                createDto.AMOUNT,                                // 14
                createDto.ACCOUNTING_DATE,                       // 15 - TO_DATE
                createDto.TAX_CODE,                              // 16
                createDto.DESCRIPTION || null                    // 17
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            const selectQuery = `
        SELECT HEADER_IFACE_ID, DIST_CODE_CONCATENATED, DIST_CODE_COMBINATION_ID, ORG_NAME, ORG_ID, SOURCE_SYSTEM,
               SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID, CREATION_DATE, CREATED_BY,
               LAST_UPDATE_DATE, LAST_UPDATED_BY, LINE_NUMBER, LINE_TYPE_LOOKUP_CODE, AMOUNT,
               ACCOUNTING_DATE, TAX_CODE, DESCRIPTION, IFACE_STATUS, IFACE_MESSAGE
        FROM XTD_AP_INVOICE_LINES_IFACE_V
        WHERE HEADER_IFACE_ID = :1 AND LINE_NUMBER = :2
        ORDER BY CREATION_DATE DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [
                createDto.HEADER_IFACE_ID,
                createDto.LINE_NUMBER
            ]);

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created AP invoice line');
            }

            const row = result.rows[0];
            return {
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                DIST_CODE_CONCATENATED: row.DIST_CODE_CONCATENATED,
                DIST_CODE_COMBINATION_ID: row.DIST_CODE_COMBINATION_ID,
                ORG_NAME: row.ORG_NAME,
                ORG_ID: row.ORG_ID,
                SOURCE_SYSTEM: row.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: row.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: row.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: row.SOURCE_BATCH_ID,
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY,
                LINE_NUMBER: row.LINE_NUMBER,
                LINE_TYPE_LOOKUP_CODE: row.LINE_TYPE_LOOKUP_CODE,
                AMOUNT: row.AMOUNT,
                ACCOUNTING_DATE: row.ACCOUNTING_DATE,
                TAX_CODE: row.TAX_CODE,
                DESCRIPTION: row.DESCRIPTION || '',
                IFACE_STATUS: row.IFACE_STATUS,
                IFACE_MESSAGE: row.IFACE_MESSAGE || ''
            };

        } catch (error) {
            this.logger.error('Error creating AP invoice line:', error);
            throw new Error(`Failed to create AP invoice line: ${error.message}`);
        }
    }

    async createApInvoiceWithLines(
        createDto: CreateApInvoiceWithLinesDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<ApInvoiceWithLinesResponseDto> {
        try {
            const headerDto: CreateApInvoiceHeaderDto = {
                INVOICE_TYPE_LOOKUP_CODE: createDto.INVOICE_TYPE_LOOKUP_CODE,
                INVOICE_DATE: createDto.INVOICE_DATE,
                VENDOR_ID: createDto.VENDOR_ID,
                VENDOR_NUM: createDto.VENDOR_NUM,
                INVOICE_AMOUNT: createDto.INVOICE_AMOUNT,
                INVOICE_NUM: createDto.INVOICE_NUM,
                VENDOR_NAME: createDto.VENDOR_NAME,
                VENDOR_SITE_ID: createDto.VENDOR_SITE_ID,
                VENDOR_SITE_CODE: createDto.VENDOR_SITE_CODE,
                INVOICE_CURRENCY_CODE: createDto.INVOICE_CURRENCY_CODE,
                TERMS_ID: createDto.TERMS_ID,
                TERMS_NAME: createDto.TERMS_NAME,
                ATTRIBUTE_CATEGORY: createDto.ATTRIBUTE_CATEGORY,
                ATTRIBUTE13: createDto.ATTRIBUTE13,
                ATTRIBUTE14: createDto.ATTRIBUTE14,
                SOURCE: createDto.SOURCE,
                INVOICE_RECEIVED_DATE: createDto.INVOICE_RECEIVED_DATE,
                GL_DATE: createDto.GL_DATE,
                PAYMENT_METHOD_CODE: createDto.PAYMENT_METHOD_CODE,
                ORG_NAME: createDto.ORG_NAME,
                ORG_ID: createDto.ORG_ID,
                SOURCE_SYSTEM: createDto.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: createDto.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: createDto.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: createDto.SOURCE_BATCH_ID,
            };

            const header = await this.createApInvoiceHeader(headerDto, userId, userName);

            const lines: ApInvoiceLineResponseDto[] = [];
            for (const line of createDto.lines) {
                const lineDto: CreateApInvoiceLineDto = {
                    HEADER_IFACE_ID: header.HEADER_IFACE_ID,
                    DIST_CODE_CONCATENATED: line.DIST_CODE_CONCATENATED,
                    DIST_CODE_COMBINATION_ID: line.DIST_CODE_COMBINATION_ID,
                    ORG_NAME: createDto.ORG_NAME,
                    ORG_ID: createDto.ORG_ID,
                    SOURCE_SYSTEM: createDto.SOURCE_SYSTEM,
                    SOURCE_HEADER_ID: createDto.SOURCE_HEADER_ID,
                    SOURCE_LINE_ID: createDto.SOURCE_LINE_ID,
                    SOURCE_BATCH_ID: createDto.SOURCE_BATCH_ID,
                    LINE_NUMBER: line.LINE_NUMBER,
                    LINE_TYPE_LOOKUP_CODE: line.LINE_TYPE_LOOKUP_CODE,
                    AMOUNT: line.AMOUNT,
                    ACCOUNTING_DATE: line.ACCOUNTING_DATE,
                    TAX_CODE: line.TAX_CODE,
                    DESCRIPTION: line.DESCRIPTION,
                };

                const createdLine = await this.createApInvoiceLine(lineDto, userId, userName);
                lines.push(createdLine);
            }

            return {
                header,
                lines,
            };

        } catch (error) {
            this.logger.error('Error creating AP invoice with lines:', error);
            throw new Error(`Failed to create AP invoice with lines: ${error.message}`);
        }
    }
}
