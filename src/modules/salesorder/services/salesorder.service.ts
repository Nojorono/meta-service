import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
    CreateSalesOrderHeaderDto,
    SalesOrderHeaderResponseDto,
    CreateSalesOrderLineDto,
    SalesOrderLineResponseDto,
    CreateSalesOrderWithLinesDto,
    SalesOrderWithLinesResponseDto,
    CreateSalesOrderReturnDto,
} from '../dtos/salesorder.dtos';

@Injectable()
export class SalesOrderService {
    private readonly logger = new Logger(SalesOrderService.name);

    constructor(private readonly oracleService: OracleService) { }

    async createSalesOrderHeader(
        createDto: CreateSalesOrderHeaderDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<SalesOrderHeaderResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_ONT_ORDER_HEADERS_IFACE_V (
          ATTRIBUTE13, ATTRIBUTE14, BOOKED_FLAG, CONTEXT, INVOICE_TO_ORG_ID, ORDER_CATEGORY_CODE,
          ORDERED_DATE, ORDER_TYPE_ID, ORG_ID, PAYMENT_TERM_ID, PRICE_LIST_ID, PRICING_DATE,
          SALESREP_ID, SHIP_FROM_ORG_ID, SHIP_TO_ORG_ID, SOLD_FROM_ORG_ID, SOLD_TO_ORG_ID,
          TRANSACTIONAL_CURR_CODE, OPERATION, FLOW_STATUS_CODE, SOURCE_SYSTEM, SOURCE_HEADER_ID,
          SOURCE_LINE_ID, SOURCE_BATCH_ID, IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, TO_DATE(:7, 'YYYY-MM-DD'), :8, :9, :10, :11, TO_DATE(:12, 'YYYY-MM-DD'),
          :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, 'READY', SYSDATE, :25, :26
        )
      `;

            const binds = [
                createDto.ATTRIBUTE13 || null,                   // 1
                createDto.ATTRIBUTE14 || null,                   // 2
                createDto.BOOKED_FLAG,                           // 3
                createDto.CONTEXT,                               // 4
                createDto.INVOICE_TO_ORG_ID,                     // 5
                createDto.ORDER_CATEGORY_CODE,                   // 6
                createDto.ORDERED_DATE,                          // 7 - TO_DATE
                createDto.ORDER_TYPE_ID,                         // 8
                createDto.ORG_ID,                                // 9
                createDto.PAYMENT_TERM_ID,                       // 10
                createDto.PRICE_LIST_ID,                         // 11
                createDto.PRICING_DATE,                          // 12 - TO_DATE
                createDto.SALESREP_ID,                           // 13
                createDto.SHIP_FROM_ORG_ID,                      // 14
                createDto.SHIP_TO_ORG_ID,                        // 15
                createDto.SOLD_FROM_ORG_ID,                      // 16
                createDto.SOLD_TO_ORG_ID,                        // 17
                createDto.TRANSACTIONAL_CURR_CODE,               // 18
                createDto.OPERATION,                             // 19
                createDto.FLOW_STATUS_CODE,                      // 20
                createDto.SOURCE_SYSTEM,                         // 21
                createDto.SOURCE_HEADER_ID,                      // 22
                createDto.SOURCE_LINE_ID,                        // 23
                createDto.SOURCE_BATCH_ID,                       // 24
                userId,                                          // 25 - CREATED_BY
                userId                                           // 26 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            const selectQuery = `
        SELECT HEADER_IFACE_ID, ATTRIBUTE13, ATTRIBUTE14, BOOKED_FLAG, CONTEXT, INVOICE_TO_ORG_ID,
               ORDER_CATEGORY_CODE, ORDERED_DATE, ORDER_TYPE_ID, ORG_ID, PAYMENT_TERM_ID,
               PRICE_LIST_ID, PRICING_DATE, SALESREP_ID, SHIP_FROM_ORG_ID, SHIP_TO_ORG_ID,
               SOLD_FROM_ORG_ID, SOLD_TO_ORG_ID, TRANSACTIONAL_CURR_CODE, OPERATION,
               FLOW_STATUS_CODE, SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID,
               IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATED_BY
        FROM XTD_ONT_ORDER_HEADERS_IFACE_V
        WHERE SOURCE_HEADER_ID = :1 AND SOURCE_SYSTEM = :2
        ORDER BY HEADER_IFACE_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [
                createDto.SOURCE_HEADER_ID,
                createDto.SOURCE_SYSTEM
            ]);

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created sales order header');
            }

            const createdRecord = result.rows[0];
            return {
                HEADER_IFACE_ID: createdRecord.HEADER_IFACE_ID,
                ATTRIBUTE13: createdRecord.ATTRIBUTE13 || '',
                ATTRIBUTE14: createdRecord.ATTRIBUTE14 || '',
                BOOKED_FLAG: createdRecord.BOOKED_FLAG,
                CONTEXT: createdRecord.CONTEXT,
                INVOICE_TO_ORG_ID: createdRecord.INVOICE_TO_ORG_ID,
                ORDER_CATEGORY_CODE: createdRecord.ORDER_CATEGORY_CODE,
                ORDERED_DATE: createdRecord.ORDERED_DATE,
                ORDER_TYPE_ID: createdRecord.ORDER_TYPE_ID,
                ORG_ID: createdRecord.ORG_ID,
                PAYMENT_TERM_ID: createdRecord.PAYMENT_TERM_ID,
                PRICE_LIST_ID: createdRecord.PRICE_LIST_ID,
                PRICING_DATE: createdRecord.PRICING_DATE,
                SALESREP_ID: createdRecord.SALESREP_ID,
                SHIP_FROM_ORG_ID: createdRecord.SHIP_FROM_ORG_ID,
                SHIP_TO_ORG_ID: createdRecord.SHIP_TO_ORG_ID,
                SOLD_FROM_ORG_ID: createdRecord.SOLD_FROM_ORG_ID,
                SOLD_TO_ORG_ID: createdRecord.SOLD_TO_ORG_ID,
                TRANSACTIONAL_CURR_CODE: createdRecord.TRANSACTIONAL_CURR_CODE,
                OPERATION: createdRecord.OPERATION,
                FLOW_STATUS_CODE: createdRecord.FLOW_STATUS_CODE,
                SOURCE_SYSTEM: createdRecord.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: createdRecord.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: createdRecord.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: createdRecord.SOURCE_BATCH_ID,
                IFACE_STATUS: createdRecord.IFACE_STATUS,
                CREATION_DATE: createdRecord.CREATION_DATE,
                CREATED_BY: createdRecord.CREATED_BY,
                LAST_UPDATED_BY: createdRecord.LAST_UPDATED_BY
            };

        } catch (error) {
            this.logger.error('Error creating sales order header:', error);
            throw new Error(`Failed to create sales order header: ${error.message}`);
        }
    }

    async createSalesOrderLine(
        createDto: CreateSalesOrderLineDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<SalesOrderLineResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_ONT_ORDER_LINES_IFACE_V (
          HEADER_IFACE_ID, BOOKED_FLAG, OPERATION, LINE_CATEGORY_CODE, LINE_NUMBER, LINE_TYPE_ID,
          ORDERED_QUANTITY, SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID,
          IFACE_OPERATION, IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, 'READY', SYSDATE, :13, SYSDATE, :14
        )
      `;

            const binds = [
                createDto.HEADER_IFACE_ID,
                createDto.BOOKED_FLAG,
                createDto.OPERATION,
                createDto.LINE_CATEGORY_CODE,
                createDto.LINE_NUMBER,
                createDto.LINE_TYPE_ID,
                createDto.ORDERED_QUANTITY,
                createDto.SOURCE_SYSTEM,
                createDto.SOURCE_HEADER_ID,
                createDto.SOURCE_LINE_ID,
                createDto.SOURCE_BATCH_ID,
                createDto.IFACE_OPERATION,
                userId,
                userId
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            const selectQuery = `
        SELECT LINE_IFACE_ID, HEADER_IFACE_ID, BOOKED_FLAG, OPERATION, LINE_CATEGORY_CODE,
               LINE_NUMBER, LINE_TYPE_ID, ORDERED_QUANTITY, SOURCE_SYSTEM, SOURCE_HEADER_ID,
               SOURCE_LINE_ID, SOURCE_BATCH_ID, IFACE_OPERATION, IFACE_STATUS, CREATION_DATE,
               CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_ONT_ORDER_LINES_IFACE_V
        WHERE HEADER_IFACE_ID = :1 AND LINE_NUMBER = :2
        ORDER BY LINE_IFACE_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [
                createDto.HEADER_IFACE_ID,
                createDto.LINE_NUMBER
            ]);

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created sales order line');
            }

            const row = result.rows[0];
            return {
                LINE_IFACE_ID: row.LINE_IFACE_ID,
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                BOOKED_FLAG: row.BOOKED_FLAG,
                OPERATION: row.OPERATION,
                LINE_CATEGORY_CODE: row.LINE_CATEGORY_CODE,
                LINE_NUMBER: row.LINE_NUMBER,
                LINE_TYPE_ID: row.LINE_TYPE_ID,
                ORDERED_QUANTITY: row.ORDERED_QUANTITY,
                SOURCE_SYSTEM: row.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: row.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: row.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: row.SOURCE_BATCH_ID,
                IFACE_OPERATION: row.IFACE_OPERATION,
                IFACE_STATUS: row.IFACE_STATUS,
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY
            };

        } catch (error) {
            this.logger.error('Error creating sales order line:', error);
            throw new Error(`Failed to create sales order line: ${error.message}`);
        }
    }

    async createSalesOrderWithLines(
        createDto: CreateSalesOrderWithLinesDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<SalesOrderWithLinesResponseDto> {
        try {
            const headerDto: CreateSalesOrderHeaderDto = {
                ATTRIBUTE13: createDto.ATTRIBUTE13,
                ATTRIBUTE14: createDto.ATTRIBUTE14,
                BOOKED_FLAG: createDto.BOOKED_FLAG,
                CONTEXT: createDto.CONTEXT,
                INVOICE_TO_ORG_ID: createDto.INVOICE_TO_ORG_ID,
                ORDER_CATEGORY_CODE: createDto.ORDER_CATEGORY_CODE,
                ORDERED_DATE: createDto.ORDERED_DATE,
                ORDER_TYPE_ID: createDto.ORDER_TYPE_ID,
                ORG_ID: createDto.ORG_ID,
                PAYMENT_TERM_ID: createDto.PAYMENT_TERM_ID,
                PRICE_LIST_ID: createDto.PRICE_LIST_ID,
                PRICING_DATE: createDto.PRICING_DATE,
                SALESREP_ID: createDto.SALESREP_ID,
                SHIP_FROM_ORG_ID: createDto.SHIP_FROM_ORG_ID,
                SHIP_TO_ORG_ID: createDto.SHIP_TO_ORG_ID,
                SOLD_FROM_ORG_ID: createDto.SOLD_FROM_ORG_ID,
                SOLD_TO_ORG_ID: createDto.SOLD_TO_ORG_ID,
                TRANSACTIONAL_CURR_CODE: createDto.TRANSACTIONAL_CURR_CODE,
                OPERATION: createDto.OPERATION,
                FLOW_STATUS_CODE: createDto.FLOW_STATUS_CODE,
                SOURCE_SYSTEM: createDto.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: createDto.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: createDto.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: createDto.SOURCE_BATCH_ID,
            };

            const header = await this.createSalesOrderHeader(headerDto, userId, userName);

            const lines: SalesOrderLineResponseDto[] = [];
            for (const line of createDto.lines) {
                const lineDto: CreateSalesOrderLineDto = {
                    HEADER_IFACE_ID: header.HEADER_IFACE_ID,
                    BOOKED_FLAG: line.BOOKED_FLAG,
                    OPERATION: line.OPERATION,
                    LINE_CATEGORY_CODE: line.LINE_CATEGORY_CODE,
                    LINE_NUMBER: line.LINE_NUMBER,
                    LINE_TYPE_ID: line.LINE_TYPE_ID,
                    ORDERED_QUANTITY: line.ORDERED_QUANTITY,
                    SOURCE_SYSTEM: createDto.SOURCE_SYSTEM,
                    SOURCE_HEADER_ID: createDto.SOURCE_HEADER_ID,
                    SOURCE_LINE_ID: line.SOURCE_LINE_ID,
                    SOURCE_BATCH_ID: createDto.SOURCE_BATCH_ID,
                    IFACE_OPERATION: line.IFACE_OPERATION,
                };

                const createdLine = await this.createSalesOrderLine(lineDto, userId, userName);
                lines.push(createdLine);
            }

            return {
                header,
                lines,
            };

        } catch (error) {
            this.logger.error('Error creating sales order with lines:', error);
            throw new Error(`Failed to create sales order with lines: ${error.message}`);
        }
    }

    async createSalesOrderReturn(
        createDto: CreateSalesOrderReturnDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<SalesOrderWithLinesResponseDto> {
        try {
            const headerDto: CreateSalesOrderHeaderDto = {
                ATTRIBUTE13: createDto.ATTRIBUTE13,
                ATTRIBUTE14: createDto.ATTRIBUTE14,
                BOOKED_FLAG: createDto.BOOKED_FLAG,
                CONTEXT: createDto.CONTEXT,
                INVOICE_TO_ORG_ID: createDto.INVOICE_TO_ORG_ID,
                ORDER_CATEGORY_CODE: 'RETURN',
                ORDERED_DATE: createDto.ORDERED_DATE,
                ORDER_TYPE_ID: createDto.ORDER_TYPE_ID,
                ORG_ID: createDto.ORG_ID,
                PAYMENT_TERM_ID: createDto.PAYMENT_TERM_ID,
                PRICE_LIST_ID: createDto.PRICE_LIST_ID,
                PRICING_DATE: createDto.PRICING_DATE,
                SALESREP_ID: createDto.SALESREP_ID,
                SHIP_FROM_ORG_ID: createDto.SHIP_FROM_ORG_ID,
                SHIP_TO_ORG_ID: createDto.SHIP_TO_ORG_ID,
                SOLD_FROM_ORG_ID: createDto.SOLD_FROM_ORG_ID,
                SOLD_TO_ORG_ID: createDto.SOLD_TO_ORG_ID,
                TRANSACTIONAL_CURR_CODE: createDto.TRANSACTIONAL_CURR_CODE,
                OPERATION: createDto.OPERATION,
                FLOW_STATUS_CODE: createDto.FLOW_STATUS_CODE,
                SOURCE_SYSTEM: createDto.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: createDto.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: createDto.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: createDto.SOURCE_BATCH_ID,
            };

            const insertQuery = `
        INSERT INTO XTD_ONT_ORDER_HEADERS_IFACE_V (
          ATTRIBUTE13, ATTRIBUTE14, BOOKED_FLAG, CONTEXT, INVOICE_TO_ORG_ID, ORDER_CATEGORY_CODE,
          ORDERED_DATE, ORDER_TYPE_ID, ORG_ID, PAYMENT_TERM_ID, PRICE_LIST_ID, PRICING_DATE,
          SALESREP_ID, SHIP_FROM_ORG_ID, SHIP_TO_ORG_ID, SOLD_FROM_ORG_ID, SOLD_TO_ORG_ID,
          TRANSACTIONAL_CURR_CODE, OPERATION, FLOW_STATUS_CODE, SOURCE_SYSTEM, SOURCE_HEADER_ID,
          SOURCE_LINE_ID, SOURCE_BATCH_ID, IFACE_STATUS, IFACE_OPERATION, CREATION_DATE, CREATED_BY, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, 'RETURN', TO_DATE(:6, 'YYYY-MM-DD'), :7, :8, :9, :10, TO_DATE(:11, 'YYYY-MM-DD'),
          :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, 'READY', :24, SYSDATE, :25, :26
        )
      `;

            const binds = [
                headerDto.ATTRIBUTE13 || null,
                headerDto.ATTRIBUTE14 || null,
                headerDto.BOOKED_FLAG,
                headerDto.CONTEXT,
                headerDto.INVOICE_TO_ORG_ID,
                headerDto.ORDERED_DATE,
                headerDto.ORDER_TYPE_ID,
                headerDto.ORG_ID,
                headerDto.PAYMENT_TERM_ID,
                headerDto.PRICE_LIST_ID,
                headerDto.PRICING_DATE,
                headerDto.SALESREP_ID,
                headerDto.SHIP_FROM_ORG_ID,
                headerDto.SHIP_TO_ORG_ID,
                headerDto.SOLD_FROM_ORG_ID,
                headerDto.SOLD_TO_ORG_ID,
                headerDto.TRANSACTIONAL_CURR_CODE,
                headerDto.OPERATION,
                headerDto.FLOW_STATUS_CODE,
                headerDto.SOURCE_SYSTEM,
                headerDto.SOURCE_HEADER_ID,
                headerDto.SOURCE_LINE_ID,
                headerDto.SOURCE_BATCH_ID,
                createDto.IFACE_OPERATION,
                userId,
                userId
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            const selectQuery = `
        SELECT HEADER_IFACE_ID, ATTRIBUTE13, ATTRIBUTE14, BOOKED_FLAG, CONTEXT, INVOICE_TO_ORG_ID,
               ORDER_CATEGORY_CODE, ORDERED_DATE, ORDER_TYPE_ID, ORG_ID, PAYMENT_TERM_ID,
               PRICE_LIST_ID, PRICING_DATE, SALESREP_ID, SHIP_FROM_ORG_ID, SHIP_TO_ORG_ID,
               SOLD_FROM_ORG_ID, SOLD_TO_ORG_ID, TRANSACTIONAL_CURR_CODE, OPERATION,
               FLOW_STATUS_CODE, SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID,
               IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATED_BY
        FROM XTD_ONT_ORDER_HEADERS_IFACE_V
        WHERE SOURCE_HEADER_ID = :1 AND SOURCE_SYSTEM = :2
        ORDER BY HEADER_IFACE_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [
                headerDto.SOURCE_HEADER_ID,
                headerDto.SOURCE_SYSTEM
            ]);

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created sales order return header');
            }

            const createdRecord = result.rows[0];
            const header: SalesOrderHeaderResponseDto = {
                HEADER_IFACE_ID: createdRecord.HEADER_IFACE_ID,
                ATTRIBUTE13: createdRecord.ATTRIBUTE13 || '',
                ATTRIBUTE14: createdRecord.ATTRIBUTE14 || '',
                BOOKED_FLAG: createdRecord.BOOKED_FLAG,
                CONTEXT: createdRecord.CONTEXT,
                INVOICE_TO_ORG_ID: createdRecord.INVOICE_TO_ORG_ID,
                ORDER_CATEGORY_CODE: createdRecord.ORDER_CATEGORY_CODE,
                ORDERED_DATE: createdRecord.ORDERED_DATE,
                ORDER_TYPE_ID: createdRecord.ORDER_TYPE_ID,
                ORG_ID: createdRecord.ORG_ID,
                PAYMENT_TERM_ID: createdRecord.PAYMENT_TERM_ID,
                PRICE_LIST_ID: createdRecord.PRICE_LIST_ID,
                PRICING_DATE: createdRecord.PRICING_DATE,
                SALESREP_ID: createdRecord.SALESREP_ID,
                SHIP_FROM_ORG_ID: createdRecord.SHIP_FROM_ORG_ID,
                SHIP_TO_ORG_ID: createdRecord.SHIP_TO_ORG_ID,
                SOLD_FROM_ORG_ID: createdRecord.SOLD_FROM_ORG_ID,
                SOLD_TO_ORG_ID: createdRecord.SOLD_TO_ORG_ID,
                TRANSACTIONAL_CURR_CODE: createdRecord.TRANSACTIONAL_CURR_CODE,
                OPERATION: createdRecord.OPERATION,
                FLOW_STATUS_CODE: createdRecord.FLOW_STATUS_CODE,
                SOURCE_SYSTEM: createdRecord.SOURCE_SYSTEM,
                SOURCE_HEADER_ID: createdRecord.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: createdRecord.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: createdRecord.SOURCE_BATCH_ID,
                IFACE_STATUS: createdRecord.IFACE_STATUS,
                CREATION_DATE: createdRecord.CREATION_DATE,
                CREATED_BY: createdRecord.CREATED_BY,
                LAST_UPDATED_BY: createdRecord.LAST_UPDATED_BY
            };

            const lines: SalesOrderLineResponseDto[] = [];
            for (const line of createDto.lines) {
                const insertLineQuery = `
        INSERT INTO XTD_ONT_ORDER_LINES_IFACE_V (
          HEADER_IFACE_ID, BOOKED_FLAG, OPERATION, LINE_CATEGORY_CODE, LINE_NUMBER, LINE_TYPE_ID,
          ORDERED_QUANTITY, SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID,
          IFACE_OPERATION, ATTRIBUTE11, IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, 'RETURN', :4, :5, :6, :7, :8, :9, :10, :11, :12, 'READY', SYSDATE, :13, SYSDATE, :14
        )
      `;

                const lineBinds = [
                    header.HEADER_IFACE_ID,
                    line.BOOKED_FLAG,
                    line.OPERATION,
                    line.LINE_NUMBER,
                    line.LINE_TYPE_ID,
                    line.ORDERED_QUANTITY,
                    createDto.SOURCE_SYSTEM,
                    createDto.SOURCE_HEADER_ID,
                    line.SOURCE_LINE_ID,
                    createDto.SOURCE_BATCH_ID,
                    line.IFACE_OPERATION,
                    line.ATTRIBUTE11,
                    userId,
                    userId
                ];

                await this.oracleService.executeQuery(insertLineQuery, lineBinds);

                const selectLineQuery = `
        SELECT LINE_IFACE_ID, HEADER_IFACE_ID, BOOKED_FLAG, OPERATION, LINE_CATEGORY_CODE,
               LINE_NUMBER, LINE_TYPE_ID, ORDERED_QUANTITY, SOURCE_SYSTEM, SOURCE_HEADER_ID,
               SOURCE_LINE_ID, SOURCE_BATCH_ID, IFACE_OPERATION, IFACE_STATUS, CREATION_DATE,
               CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_ONT_ORDER_LINES_IFACE_V
        WHERE HEADER_IFACE_ID = :1 AND LINE_NUMBER = :2
        ORDER BY LINE_IFACE_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

                const lineResult = await this.oracleService.executeQuery(selectLineQuery, [
                    header.HEADER_IFACE_ID,
                    line.LINE_NUMBER
                ]);

                if (lineResult.rows.length === 0) {
                    throw new Error('Failed to retrieve created sales order return line');
                }

                const lineRow = lineResult.rows[0];
                const createdLine: SalesOrderLineResponseDto = {
                    LINE_IFACE_ID: lineRow.LINE_IFACE_ID,
                    HEADER_IFACE_ID: lineRow.HEADER_IFACE_ID,
                    BOOKED_FLAG: lineRow.BOOKED_FLAG,
                    OPERATION: lineRow.OPERATION,
                    LINE_CATEGORY_CODE: lineRow.LINE_CATEGORY_CODE,
                    LINE_NUMBER: lineRow.LINE_NUMBER,
                    LINE_TYPE_ID: lineRow.LINE_TYPE_ID,
                    ORDERED_QUANTITY: lineRow.ORDERED_QUANTITY,
                    SOURCE_SYSTEM: lineRow.SOURCE_SYSTEM,
                    SOURCE_HEADER_ID: lineRow.SOURCE_HEADER_ID,
                    SOURCE_LINE_ID: lineRow.SOURCE_LINE_ID,
                    SOURCE_BATCH_ID: lineRow.SOURCE_BATCH_ID,
                    IFACE_OPERATION: lineRow.IFACE_OPERATION,
                    IFACE_STATUS: lineRow.IFACE_STATUS,
                    CREATION_DATE: lineRow.CREATION_DATE,
                    CREATED_BY: lineRow.CREATED_BY,
                    LAST_UPDATE_DATE: lineRow.LAST_UPDATE_DATE,
                    LAST_UPDATED_BY: lineRow.LAST_UPDATED_BY
                };

                lines.push(createdLine);
            }

            return {
                header,
                lines,
            };

        } catch (error) {
            this.logger.error('Error creating sales order return:', error);
            throw new Error(`Failed to create sales order return: ${error.message}`);
        }
    }
}
