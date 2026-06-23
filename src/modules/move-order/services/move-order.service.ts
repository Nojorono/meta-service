import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
    CreateMoveOrderDto,
    MoveOrderResponseDto,
    GetMoveOrdersQueryDto,
    CreateMoveOrderLineDto,
    MoveOrderLineResponseDto,
    GetMoveOrderLinesQueryDto,
    CreateMoveOrderWithLinesDto,
    MoveOrderWithLinesResponseDto,
    MoveOrderFindWithLinesResponseDto,
} from '../dtos';

@Injectable()
export class MoveOrderService {
    private readonly logger = new Logger(MoveOrderService.name);

    constructor(private readonly oracleService: OracleService) { }

    async createMoveOrder(
        createDto: CreateMoveOrderDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<MoveOrderResponseDto> {
        try {
            const sourceSystem = createDto.SOURCE_SYSTEM ?? userName;
            const createdBy = createDto.CREATED_BY ?? userId;
            const lastUpdatedBy = createDto.LAST_UPDATED_BY ?? userId;

            const insertQuery = `
        INSERT INTO XTD_INV_MO_HEADERS_IFACE_V (
          REQUEST_NUMBER, TRANSACTION_TYPE_ID, MOVE_ORDER_TYPE, ORGANIZATION_ID,
          DATE_REQUIRED, FROM_SUBINVENTORY_CODE, TO_SUBINVENTORY_CODE,
          HEADER_STATUS, STATUS_DATE, ATTRIBUTE_CATEGORY,
          ATTRIBUTE7, ATTRIBUTE8, ATTRIBUTE9, ATTRIBUTE10, ATTRIBUTE11, ATTRIBUTE12, ATTRIBUTE13, ATTRIBUTE14,
          OPERATION, DB_FLAG, SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID,
          IFACE_STATUS, IFACE_MODE, TOTAL_LINES,
          CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4,
          TO_DATE(:5, 'YYYY-MM-DD'), :6, :7,
          :8, TO_DATE(:9, 'YYYY-MM-DD'), :10,
          :11, :12, :13, :14, :15, :16, :17, :18,
          :19, :20, :21, :22, :23, :24,
          :25, :26, :27,
          NVL(TO_DATE(:28, 'YYYY-MM-DD'), SYSDATE), :29,
          NVL(TO_DATE(:30, 'YYYY-MM-DD'), SYSDATE), :31
        )
      `;

            const binds: (string | number | null)[] = [
                createDto.REQUEST_NUMBER,
                createDto.TRANSACTION_TYPE_ID,
                createDto.MOVE_ORDER_TYPE,
                createDto.ORGANIZATION_ID,
                createDto.DATE_REQUIRED,
                createDto.FROM_SUBINVENTORY_CODE,
                createDto.TO_SUBINVENTORY_CODE,
                createDto.HEADER_STATUS,
                createDto.STATUS_DATE,
                createDto.ATTRIBUTE_CATEGORY ?? null,
                createDto.ATTRIBUTE7 ?? null,
                createDto.ATTRIBUTE8 ?? null,
                createDto.ATTRIBUTE9 ?? null,
                createDto.ATTRIBUTE10 ?? null,
                createDto.ATTRIBUTE11 ?? null,
                createDto.ATTRIBUTE12 ?? null,
                createDto.ATTRIBUTE13 ?? null,
                createDto.ATTRIBUTE14 ?? null,
                createDto.OPERATION ?? 'CREATE',
                createDto.DB_FLAG ?? 'T',
                sourceSystem,
                createDto.SOURCE_HEADER_ID ?? null,
                createDto.SOURCE_LINE_ID ?? null,
                createDto.SOURCE_BATCH_ID ?? null,
                createDto.IFACE_STATUS ?? 'READY',
                createDto.IFACE_MODE ?? 'MOVE_ORDER',
                createDto.TOTAL_LINES ?? null,
                createDto.CREATION_DATE ?? null,
                createdBy,
                createDto.LAST_UPDATE_DATE ?? null,
                lastUpdatedBy,
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            const selectQuery = `
        SELECT HEADER_IFACE_ID, REQUEST_NUMBER, IFACE_STATUS, IFACE_MESSAGE,
               CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MO_HEADERS_IFACE_V
        WHERE REQUEST_NUMBER = :1 AND SOURCE_SYSTEM = :2
        ORDER BY HEADER_IFACE_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [
                createDto.REQUEST_NUMBER,
                sourceSystem,
            ]);

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created move order');
            }

            const createdRecord = result.rows[0];
            return {
                HEADER_IFACE_ID: createdRecord.HEADER_IFACE_ID,
                REQUEST_NUMBER: createdRecord.REQUEST_NUMBER,
                IFACE_STATUS: createdRecord.IFACE_STATUS,
                IFACE_MESSAGE: createdRecord.IFACE_MESSAGE || '',
                CREATION_DATE: createdRecord.CREATION_DATE,
                CREATED_BY: createdRecord.CREATED_BY,
                LAST_UPDATE_DATE: createdRecord.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: createdRecord.LAST_UPDATED_BY
            };

        } catch (error) {
            const bindFieldNames = [
                'REQUEST_NUMBER',
                'TRANSACTION_TYPE_ID',
                'MOVE_ORDER_TYPE',
                'ORGANIZATION_ID',
                'DATE_REQUIRED',
                'FROM_SUBINVENTORY_CODE',
                'TO_SUBINVENTORY_CODE',
                'HEADER_STATUS',
                'STATUS_DATE',
                'ATTRIBUTE_CATEGORY',
                'ATTRIBUTE7',
                'ATTRIBUTE8',
                'ATTRIBUTE9',
                'ATTRIBUTE10',
                'ATTRIBUTE11',
                'ATTRIBUTE12',
                'ATTRIBUTE13',
                'ATTRIBUTE14',
                'OPERATION',
                'DB_FLAG',
                'SOURCE_SYSTEM',
                'SOURCE_HEADER_ID',
                'SOURCE_LINE_ID',
                'SOURCE_BATCH_ID',
                'IFACE_STATUS',
                'IFACE_MODE',
                'TOTAL_LINES',
                'CREATION_DATE',
                'CREATED_BY',
                'LAST_UPDATE_DATE',
                'LAST_UPDATED_BY',
            ];

            const message = String(error?.message || '');
            const placeholderMatch = message.match(/placeholder\s*:(\d+)/i);
            if (placeholderMatch) {
                const bindIndex = Number(placeholderMatch[1]);
                const fieldName = bindFieldNames[bindIndex - 1] || `bind_${bindIndex}`;
                this.logger.error(
                    `Error creating move order: missing/invalid bind for ${fieldName} (placeholder :${bindIndex})`,
                    error?.stack,
                );
                throw new Error(
                    `Failed to create move order: ${message} [field: ${fieldName}]`,
                );
            }

            this.logger.error('Error creating move order:', error);
            throw new Error(`Failed to create move order: ${message}`);
        }
    }

    async getMoveOrders(queryDto: GetMoveOrdersQueryDto): Promise<MoveOrderResponseDto[]> {
        try {
            let whereConditions = [];
            let binds: any[] = [];

            let paramIndex = 1;

            if (queryDto.REQUEST_NUMBER) {
                whereConditions.push(`REQUEST_NUMBER LIKE :${paramIndex}`);
                binds.push(`%${queryDto.REQUEST_NUMBER}%`);
                paramIndex++;
            }
            if (queryDto.ORGANIZATION_ID) {
                whereConditions.push(`ORGANIZATION_ID = :${paramIndex}`);
                binds.push(queryDto.ORGANIZATION_ID);
                paramIndex++;
            }
            if (queryDto.HEADER_STATUS) {
                whereConditions.push(`HEADER_STATUS = :${paramIndex}`);
                binds.push(queryDto.HEADER_STATUS);
                paramIndex++;
            }
            if (queryDto.IFACE_STATUS) {
                whereConditions.push(`IFACE_STATUS = :${paramIndex}`);
                binds.push(queryDto.IFACE_STATUS);
                paramIndex++;
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
            const page = queryDto.PAGE || 1;
            const limit = queryDto.LIMIT || 10;
            const offset = (page - 1) * limit;

            const selectQuery = `
        SELECT HEADER_IFACE_ID, REQUEST_NUMBER, IFACE_STATUS, IFACE_MESSAGE,
               CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MO_HEADERS_IFACE_V
        ${whereClause}
        ORDER BY CREATION_DATE DESC
      `;
            const result = await this.oracleService.executeQuery(selectQuery, binds);

            return result.rows.map((row: any) => ({
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                REQUEST_NUMBER: row.REQUEST_NUMBER,
                IFACE_STATUS: row.IFACE_STATUS,
                IFACE_MESSAGE: row.IFACE_MESSAGE || '',
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY
            }));

        } catch (error) {
            this.logger.error('Error getting move orders:', error);
            throw new Error(`Failed to get move orders: ${error.message}`);
        }
    }

    async getMoveOrderById(headerIfaceId: number): Promise<MoveOrderResponseDto> {
        try {
            const selectQuery = `
        SELECT HEADER_IFACE_ID, REQUEST_NUMBER, IFACE_STATUS, IFACE_MESSAGE,
               CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MO_LINES_IFACE_V
        WHERE HEADER_IFACE_ID = :1
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [headerIfaceId]);

            if (result.rows.length === 0) {
                throw new Error('Move order not found');
            }

            const row = result.rows[0];
            return {
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                REQUEST_NUMBER: row.REQUEST_NUMBER,
                IFACE_STATUS: row.IFACE_STATUS,
                IFACE_MESSAGE: row.IFACE_MESSAGE || '',
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY
            };

        } catch (error) {
            this.logger.error('Error getting move order by ID:', error);
            throw new Error(`Failed to get move order: ${error.message}`);
        }
    }


    async deleteMoveOrder(headerIfaceId: number): Promise<boolean> {
        try {
            const deleteQuery = `DELETE FROM XTD_INV_MO_HEADERS_IFACE_V WHERE HEADER_IFACE_ID = :1`;
            await this.oracleService.executeQuery(deleteQuery, [headerIfaceId]);
            return true;
        } catch (error) {
            this.logger.error('Error deleting move order:', error);
            return false;
        }
    }

    async createMoveOrderLine(
        createDto: CreateMoveOrderLineDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<MoveOrderLineResponseDto> {
        try {
            const sourceSystem = createDto.SOURCE_SYSTEM ?? userName;
            const createdBy = createDto.CREATED_BY ?? userId;
            const lastUpdatedBy = createDto.LAST_UPDATED_BY ?? userId;

            const insertQuery = `
        INSERT INTO XTD_INV_MO_LINES_IFACE_V (
          HEADER_IFACE_ID, LINE_NUMBER, ORGANIZATION_ID, INVENTORY_ITEM_ID,
          FROM_SUBINVENTORY_CODE, FROM_LOCATOR_ID, TO_SUBINVENTORY_CODE, TO_LOCATOR_ID,
          UOM_CODE, QUANTITY, DATE_REQUIRED, TRANSACTION_TYPE_ID, TRANSACTION_SOURCE_TYPE_ID,
          LINE_STATUS, STATUS_DATE, OPERATION, DB_FLAG, SOURCE_SYSTEM,
          SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID, IFACE_STATUS,
          CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4,
          :5, :6, :7, :8,
          :9, :10, TO_DATE(:11, 'YYYY-MM-DD'), :12, :13,
          :14, TO_DATE(:15, 'YYYY-MM-DD'), :16, :17, :18,
          :19, :20, :21, :22,
          NVL(TO_DATE(:23, 'YYYY-MM-DD'), SYSDATE), :24,
          NVL(TO_DATE(:25, 'YYYY-MM-DD'), SYSDATE), :26
        )
      `;

            const binds: (string | number | null)[] = [
                createDto.HEADER_IFACE_ID,
                createDto.LINE_NUMBER,
                createDto.ORGANIZATION_ID,
                createDto.INVENTORY_ITEM_ID,
                createDto.FROM_SUBINVENTORY_CODE,
                createDto.FROM_LOCATOR_ID ?? null,
                createDto.TO_SUBINVENTORY_CODE,
                createDto.TO_LOCATOR_ID ?? null,
                createDto.UOM_CODE,
                createDto.QUANTITY,
                createDto.DATE_REQUIRED,
                createDto.TRANSACTION_TYPE_ID,
                createDto.TRANSACTION_SOURCE_TYPE_ID,
                createDto.LINE_STATUS,
                createDto.STATUS_DATE,
                createDto.OPERATION ?? 'CREATE',
                createDto.DB_FLAG ?? 'T',
                sourceSystem,
                createDto.SOURCE_HEADER_ID ?? null,
                createDto.SOURCE_LINE_ID ?? null,
                createDto.SOURCE_BATCH_ID ?? null,
                createDto.IFACE_STATUS ?? 'READY',
                createDto.CREATION_DATE ?? null,
                createdBy,
                createDto.LAST_UPDATE_DATE ?? null,
                lastUpdatedBy,
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            const selectQuery = `
        SELECT LINE_IFACE_ID, HEADER_IFACE_ID, LINE_NUMBER, ORGANIZATION_ID, INVENTORY_ITEM_ID,
               FROM_SUBINVENTORY_CODE, TO_SUBINVENTORY_CODE, UOM_CODE, QUANTITY, TRANSACTION_TYPE_ID,
               LINE_STATUS, IFACE_STATUS, IFACE_MESSAGE, CREATION_DATE, CREATED_BY,
               LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MO_LINES_IFACE_V
        WHERE HEADER_IFACE_ID = :1 AND LINE_NUMBER = :2
        ORDER BY LINE_IFACE_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [
                createDto.HEADER_IFACE_ID,
                createDto.LINE_NUMBER
            ]);

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created move order line');
            }

            const row = result.rows[0];
            return {
                LINE_IFACE_ID: row.LINE_IFACE_ID,
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                LINE_NUMBER: row.LINE_NUMBER,
                ORGANIZATION_ID: row.ORGANIZATION_ID,
                INVENTORY_ITEM_ID: row.INVENTORY_ITEM_ID,
                FROM_SUBINVENTORY_CODE: row.FROM_SUBINVENTORY_CODE,
                TO_SUBINVENTORY_CODE: row.TO_SUBINVENTORY_CODE,
                UOM_CODE: row.UOM_CODE,
                QUANTITY: row.QUANTITY,
                TRANSACTION_TYPE_ID: row.TRANSACTION_TYPE_ID,
                LINE_STATUS: row.LINE_STATUS,
                IFACE_STATUS: row.IFACE_STATUS,
                IFACE_MESSAGE: row.IFACE_MESSAGE || '',
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY
            };

        } catch (error) {
            const bindFieldNames = [
                'HEADER_IFACE_ID',
                'LINE_NUMBER',
                'ORGANIZATION_ID',
                'INVENTORY_ITEM_ID',
                'FROM_SUBINVENTORY_CODE',
                'FROM_LOCATOR_ID',
                'TO_SUBINVENTORY_CODE',
                'TO_LOCATOR_ID',
                'UOM_CODE',
                'QUANTITY',
                'DATE_REQUIRED',
                'TRANSACTION_TYPE_ID',
                'TRANSACTION_SOURCE_TYPE_ID',
                'LINE_STATUS',
                'STATUS_DATE',
                'OPERATION',
                'DB_FLAG',
                'SOURCE_SYSTEM',
                'SOURCE_HEADER_ID',
                'SOURCE_LINE_ID',
                'SOURCE_BATCH_ID',
                'IFACE_STATUS',
                'CREATION_DATE',
                'CREATED_BY',
                'LAST_UPDATE_DATE',
                'LAST_UPDATED_BY',
            ];

            const message = String(error?.message || '');
            const placeholderMatch = message.match(/placeholder\s*:(\d+)/i);
            if (placeholderMatch) {
                const bindIndex = Number(placeholderMatch[1]);
                const fieldName = bindFieldNames[bindIndex - 1] || `bind_${bindIndex}`;
                this.logger.error(
                    `Error creating move order line: missing/invalid bind for ${fieldName} (placeholder :${bindIndex})`,
                    error?.stack,
                );
                throw new Error(
                    `Failed to create move order line: ${message} [field: ${fieldName}]`,
                );
            }

            this.logger.error('Error creating move order line:', error);
            throw new Error(`Failed to create move order line: ${message}`);
        }
    }

    async getMoveOrderLines(queryDto: GetMoveOrderLinesQueryDto): Promise<MoveOrderLineResponseDto[]> {
        try {
            let whereConditions = [];
            let binds: any[] = [];

            let paramIndex = 1;

            if (queryDto.HEADER_IFACE_ID) {
                whereConditions.push(`HEADER_IFACE_ID = :${paramIndex}`);
                binds.push(queryDto.HEADER_IFACE_ID);
                paramIndex++;
            }
            if (queryDto.ORGANIZATION_ID) {
                whereConditions.push(`ORGANIZATION_ID = :${paramIndex}`);
                binds.push(queryDto.ORGANIZATION_ID);
                paramIndex++;
            }

            const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
            const page = queryDto.PAGE || 1;
            const limit = queryDto.LIMIT || 10;
            const offset = (page - 1) * limit;

            const selectQuery = `
        SELECT LINE_IFACE_ID, HEADER_IFACE_ID, LINE_NUMBER, ORGANIZATION_ID, INVENTORY_ITEM_ID,
               FROM_SUBINVENTORY_CODE, TO_SUBINVENTORY_CODE, UOM_CODE, QUANTITY, TRANSACTION_TYPE_ID,
               LINE_STATUS, IFACE_STATUS, IFACE_MESSAGE, CREATION_DATE, CREATED_BY,
               LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MO_LINES_IFACE_V
        ${whereClause}
        ORDER BY CREATION_DATE DESC
      `;
            const result = await this.oracleService.executeQuery(selectQuery, binds);

            return result.rows.map((row: any) => ({
                LINE_IFACE_ID: row.LINE_IFACE_ID,
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                LINE_NUMBER: row.LINE_NUMBER,
                ORGANIZATION_ID: row.ORGANIZATION_ID,
                INVENTORY_ITEM_ID: row.INVENTORY_ITEM_ID,
                FROM_SUBINVENTORY_CODE: row.FROM_SUBINVENTORY_CODE,
                TO_SUBINVENTORY_CODE: row.TO_SUBINVENTORY_CODE,
                UOM_CODE: row.UOM_CODE,
                QUANTITY: row.QUANTITY,
                TRANSACTION_TYPE_ID: row.TRANSACTION_TYPE_ID,
                LINE_STATUS: row.LINE_STATUS,
                IFACE_STATUS: row.IFACE_STATUS,
                IFACE_MESSAGE: row.IFACE_MESSAGE || '',
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY
            }));

        } catch (error) {
            this.logger.error('Error getting move order lines:', error);
            throw new Error(`Failed to get move order lines: ${error.message}`);
        }
    }

    async getMoveOrderLineById(lineIfaceId: number): Promise<MoveOrderLineResponseDto> {
        try {
            const selectQuery = `
        SELECT LINE_IFACE_ID, HEADER_IFACE_ID, LINE_NUMBER, ORGANIZATION_ID, INVENTORY_ITEM_ID,
               FROM_SUBINVENTORY_CODE, TO_SUBINVENTORY_CODE, UOM_CODE, QUANTITY, TRANSACTION_TYPE_ID,
               LINE_STATUS, IFACE_STATUS, IFACE_MESSAGE, CREATION_DATE, CREATED_BY,
               LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MO_LINES_IFACE_V
        WHERE LINE_IFACE_ID = :1
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [lineIfaceId]);

            if (result.rows.length === 0) {
                throw new Error('Move order line not found');
            }

            const row = result.rows[0];
            return {
                LINE_IFACE_ID: row.LINE_IFACE_ID,
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                LINE_NUMBER: row.LINE_NUMBER,
                ORGANIZATION_ID: row.ORGANIZATION_ID,
                INVENTORY_ITEM_ID: row.INVENTORY_ITEM_ID,
                FROM_SUBINVENTORY_CODE: row.FROM_SUBINVENTORY_CODE,
                TO_SUBINVENTORY_CODE: row.TO_SUBINVENTORY_CODE,
                UOM_CODE: row.UOM_CODE,
                QUANTITY: row.QUANTITY,
                TRANSACTION_TYPE_ID: row.TRANSACTION_TYPE_ID,
                LINE_STATUS: row.LINE_STATUS,
                IFACE_STATUS: row.IFACE_STATUS,
                IFACE_MESSAGE: row.IFACE_MESSAGE || '',
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY
            };

        } catch (error) {
            this.logger.error('Error getting move order line by ID:', error);
            throw new Error(`Failed to get move order line: ${error.message}`);
        }
    }

    
    async deleteMoveOrderLine(lineIfaceId: number): Promise<boolean> {
        try {
            const deleteQuery = `DELETE FROM XTD_INV_MO_LINES_IFACE_V WHERE LINE_IFACE_ID = :1`;
            await this.oracleService.executeQuery(deleteQuery, [lineIfaceId]);
            return true;
        } catch (error) {
            this.logger.error('Error deleting move order line:', error);
            return false;
        }
    }

    async getMoveOrderLinesByHeaderId(headerIfaceId: number): Promise<MoveOrderLineResponseDto[]> {
        try {
            const selectQuery = `
        SELECT LINE_IFACE_ID, HEADER_IFACE_ID, LINE_NUMBER, ORGANIZATION_ID, INVENTORY_ITEM_ID,
               FROM_SUBINVENTORY_CODE, TO_SUBINVENTORY_CODE, UOM_CODE, QUANTITY, TRANSACTION_TYPE_ID,
               LINE_STATUS, IFACE_STATUS, IFACE_MESSAGE, CREATION_DATE, CREATED_BY,
               LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MO_LINES_IFACE_V
        WHERE HEADER_IFACE_ID = :1
        ORDER BY LINE_NUMBER ASC
      `;

            const result = await this.oracleService.executeQuery(selectQuery, [headerIfaceId]);

            return result.rows.map((row: any) => ({
                LINE_IFACE_ID: row.LINE_IFACE_ID,
                HEADER_IFACE_ID: row.HEADER_IFACE_ID,
                LINE_NUMBER: row.LINE_NUMBER,
                ORGANIZATION_ID: row.ORGANIZATION_ID,
                INVENTORY_ITEM_ID: row.INVENTORY_ITEM_ID,
                FROM_SUBINVENTORY_CODE: row.FROM_SUBINVENTORY_CODE,
                TO_SUBINVENTORY_CODE: row.TO_SUBINVENTORY_CODE,
                UOM_CODE: row.UOM_CODE,
                QUANTITY: row.QUANTITY,
                TRANSACTION_TYPE_ID: row.TRANSACTION_TYPE_ID,
                LINE_STATUS: row.LINE_STATUS,
                IFACE_STATUS: row.IFACE_STATUS,
                IFACE_MESSAGE: row.IFACE_MESSAGE || '',
                CREATION_DATE: row.CREATION_DATE,
                CREATED_BY: row.CREATED_BY,
                LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: row.LAST_UPDATED_BY
            }));

        } catch (error) {
            this.logger.error('Error getting move order lines by header ID:', error);
            throw new Error(`Failed to get move order lines: ${error.message}`);
        }
    }

    // find header with lines by REQUEST_NUMBER
    async findMoveOrderWithLinesByRequestNumber(
        requestNumber: string,
        sourceSystem?: string,
    ): Promise<MoveOrderFindWithLinesResponseDto> {
        const trimmedRequestNumber = requestNumber?.trim();

        if (!trimmedRequestNumber) {
            return {
                status: false,
                message: 'request_number is required',
                data: null,
            };
        }

        try {
            let headerQuery = `
                SELECT *
                FROM XTD_INV_MO_HEADERS_IFACE_V
                WHERE REQUEST_NUMBER = :1
            `;
            const binds: string[] = [trimmedRequestNumber];

            if (sourceSystem?.trim()) {
                headerQuery += ` AND SOURCE_SYSTEM = :2`;
                binds.push(sourceSystem.trim());
            }

            headerQuery += `
                ORDER BY HEADER_IFACE_ID DESC
                FETCH FIRST 1 ROW ONLY
            `;

            const headerResult = await this.oracleService.executeQuery(
                headerQuery,
                binds,
            );

            if (headerResult.rows.length === 0) {
                const label = sourceSystem?.trim()
                    ? `request_number ${trimmedRequestNumber} and source_system ${sourceSystem.trim()}`
                    : `request_number ${trimmedRequestNumber}`;
                return {
                    status: false,
                    message: `No move order found for ${label}`,
                    data: null,
                };
            }

            const header = headerResult.rows[0];
            const linesResult = await this.oracleService.executeQuery(
                `
                    SELECT *
                    FROM XTD_INV_MO_LINES_IFACE_V
                    WHERE HEADER_IFACE_ID = :1
                    ORDER BY LINE_NUMBER ASC, LINE_IFACE_ID DESC
                `,
                [header.HEADER_IFACE_ID],
            );
            const lines = linesResult.rows || [];

            return {
                status: true,
                message: 'Move order with lines retrieved successfully',
                data: {
                    ...header,
                    lines,
                },
            };
        } catch (error) {
            this.logger.error(
                `Error finding move order with lines by request number: ${error.message}`,
                error.stack,
            );
            return {
                status: false,
                message: `Error retrieving move order with lines: ${error.message}`,
                data: null,
            };
        }
    }

    async createMoveOrderWithLines(
        createDto: CreateMoveOrderWithLinesDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<MoveOrderWithLinesResponseDto> {
        this.logger.log(`Creating move order with ${createDto.lines.length} lines for user ${userName}`);

        try {
            const createdLines: MoveOrderLineResponseDto[] = [];
            const errors: string[] = [];
            let successfulLines = 0;
            let failedLines = 0;

            const { lines, ...headerFields } = createDto;
            const headerDto: CreateMoveOrderDto = {
                ...headerFields,
                TOTAL_LINES: createDto.TOTAL_LINES ?? lines.length,
            };

            const createdHeader = await this.createMoveOrder(
                headerDto,
                userId,
                userName,
            );
            this.logger.log(`Header created with ID: ${createdHeader.HEADER_IFACE_ID}`);

            for (let i = 0; i < lines.length; i++) {
                const lineDto = lines[i];
                try {
                    const fullLineDto: CreateMoveOrderLineDto = {
                        ...lineDto,
                        HEADER_IFACE_ID: createdHeader.HEADER_IFACE_ID,
                        SOURCE_SYSTEM:
                            lineDto.SOURCE_SYSTEM ??
                            headerDto.SOURCE_SYSTEM ??
                            userName,
                    };

                    const createdLine = await this.createMoveOrderLine(fullLineDto, userId, userName);
                    createdLines.push(createdLine);
                    successfulLines++;
                    this.logger.log(`Line ${i + 1} created successfully with ID: ${createdLine.LINE_IFACE_ID}`);

                } catch (error) {
                    failedLines++;
                    const errorMessage = `Failed to create line ${i + 1}: ${error.message}`;
                    errors.push(errorMessage);
                    this.logger.error(errorMessage);
                }
            }

            const response: MoveOrderWithLinesResponseDto = {
                header: createdHeader,
                lines: createdLines,
                summary: {
                    totalLines: lines.length,
                    successfulLines,
                    failedLines,
                    errors: errors.length > 0 ? errors : undefined
                }
            };

            this.logger.log(`Move order creation completed. Header: ${createdHeader.HEADER_IFACE_ID}, Lines: ${successfulLines}/${lines.length} successful`);

            return response;

        } catch (error) {
            this.logger.error('Error creating move order with lines:', error);
            throw new Error(`Failed to create move order with lines: ${error.message}`);
        }
    }
}