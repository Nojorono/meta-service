import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
    CreateMoveOrderDto,
    MoveOrderResponseDto,
    UpdateMoveOrderDto,
    GetMoveOrdersQueryDto,
    CreateMoveOrderLineDto,
    MoveOrderLineResponseDto,
    UpdateMoveOrderLineDto,
    GetMoveOrderLinesQueryDto,
    CreateMoveOrderWithLinesDto,
    MoveOrderWithLinesResponseDto,
    CreateMoveOrderLineForHeaderDto,
} from '../dtos/move-order.dtos';

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
            const insertQuery = `
        INSERT INTO XTD_INV_MO_HEADERS_IFACE_V (
          REQUEST_NUMBER, TRANSACTION_TYPE_ID, MOVE_ORDER_TYPE, ORGANIZATION_ID, DESCRIPTION,
          DATE_REQUIRED, FROM_SUBINVENTORY_CODE, TO_SUBINVENTORY_CODE, TO_ACCOUNT_ID, GROUPING_RULE_ID,
          SHIP_TO_LOCATION_ID, REFERENCE_ID, HEADER_STATUS, STATUS_DATE, ATTRIBUTE_CATEGORY,
          ATTRIBUTE1, ATTRIBUTE2, ATTRIBUTE3, ATTRIBUTE4, ATTRIBUTE5, ATTRIBUTE6, ATTRIBUTE7,
          ATTRIBUTE8, ATTRIBUTE9, ATTRIBUTE10, ATTRIBUTE11, ATTRIBUTE12, ATTRIBUTE13, ATTRIBUTE14,
          ATTRIBUTE15, PROGRAM_APPLICATION_ID, PROGRAM_ID, PROGRAM_UPDATE_DATE, OPERATION, DB_FLAG,
          SOURCE_SYSTEM, SOURCE_HEADER_ID, SOURCE_LINE_ID, SOURCE_BATCH_ID, IFACE_STATUS,
          IFACE_MESSAGE, IFACE_MODE, CREATION_DATE, CREATED_BY, LAST_UPDATE_LOGIN,
          LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, TO_DATE(:6, 'YYYY-MM-DD'), :7, :8, :9, :10, :11, :12, :13, TO_DATE(:14, 'YYYY-MM-DD'), :15,
          :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, TO_DATE(:33, 'YYYY-MM-DD'),
          'CREATE', 'T', :34, :35, :36, :37, 'READY', '', 'MOVE_ORDER', SYSDATE, :38, NULL, SYSDATE, :39
        )
      `;

            const binds = [
                createDto.REQUEST_NUMBER,                    // 1
                createDto.TRANSACTION_TYPE_ID,               // 2
                createDto.MOVE_ORDER_TYPE,                   // 3
                createDto.ORGANIZATION_ID,                   // 4
                createDto.DESCRIPTION || null,               // 5
                createDto.DATE_REQUIRED,                     // 6 - TO_DATE
                createDto.FROM_SUBINVENTORY_CODE,            // 7
                createDto.TO_SUBINVENTORY_CODE,              // 8
                createDto.TO_ACCOUNT_ID || null,             // 9
                createDto.GROUPING_RULE_ID || null,          // 10
                createDto.SHIP_TO_LOCATION_ID || null,       // 11
                createDto.REFERENCE_ID || null,              // 12
                createDto.HEADER_STATUS,                     // 13
                createDto.STATUS_DATE,                       // 14 - TO_DATE
                createDto.ATTRIBUTE_CATEGORY || null,        // 15
                createDto.ATTRIBUTE1 || null,                // 16
                createDto.ATTRIBUTE2 || null,                // 17
                createDto.ATTRIBUTE3 || null,                // 18
                createDto.ATTRIBUTE4 || null,                // 19
                createDto.ATTRIBUTE5 || null,                // 20
                createDto.ATTRIBUTE6 || null,                // 21
                createDto.ATTRIBUTE7 || null,                // 22
                createDto.ATTRIBUTE8 || null,                // 23
                createDto.ATTRIBUTE9 || null,                // 24
                createDto.ATTRIBUTE10 || null,               // 25
                createDto.ATTRIBUTE11 || null,               // 26
                createDto.ATTRIBUTE12 || null,               // 27
                createDto.ATTRIBUTE13 || null,               // 28
                createDto.ATTRIBUTE14 || null,               // 29
                createDto.ATTRIBUTE15 || null,               // 30
                createDto.PROGRAM_APPLICATION_ID || null,    // 31
                createDto.PROGRAM_ID || null,                // 32
                createDto.PROGRAM_UPDATE_DATE || null,       // 33 - TO_DATE
                userName,                                    // 34 - SOURCE_SYSTEM
                createDto.SOURCE_HEADER_ID || null,          // 35
                createDto.SOURCE_LINE_ID || null,            // 36
                createDto.SOURCE_BATCH_ID || null,           // 37
                userId,                                      // 38 - CREATED_BY
                userId                                       // 39 - LAST_UPDATED_BY
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
                userName
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
            this.logger.error('Error creating move order:', error);
            throw new Error(`Failed to create move order: ${error.message}`);
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

    async updateMoveOrder(
        headerIfaceId: number,
        updateDto: UpdateMoveOrderDto,
        userId: number = 1234,
    ): Promise<MoveOrderResponseDto> {
        try {
            const updateFields = [];
            const binds: any[] = [];

            if (updateDto.DESCRIPTION !== undefined) {
                updateFields.push('DESCRIPTION = ?');
                binds.push(updateDto.DESCRIPTION);
            }
            if (updateDto.HEADER_STATUS !== undefined) {
                updateFields.push('HEADER_STATUS = ?');
                binds.push(updateDto.HEADER_STATUS);
            }
            if (updateDto.IFACE_STATUS !== undefined) {
                updateFields.push('IFACE_STATUS = ?');
                binds.push(updateDto.IFACE_STATUS);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            updateFields.push('LAST_UPDATE_DATE = SYSDATE', 'LAST_UPDATED_BY = ?');
            binds.push(userId, headerIfaceId);

            const updateQuery = `
        UPDATE MTL_TXN_REQUEST_HEADERS_IFACE 
        SET ${updateFields.join(', ')}
        WHERE HEADER_IFACE_ID = :1
      `;

            await this.oracleService.executeQuery(updateQuery, binds);
            return await this.getMoveOrderById(headerIfaceId);

        } catch (error) {
            this.logger.error('Error updating move order:', error);
            throw new Error(`Failed to update move order: ${error.message}`);
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
            const insertQuery = `
        INSERT INTO XTD_INV_MO_LINES_IFACE_V (
          HEADER_IFACE_ID, LINE_NUMBER, ORGANIZATION_ID, INVENTORY_ITEM_ID, FROM_SUBINVENTORY_CODE,
          TO_SUBINVENTORY_CODE, UOM_CODE, QUANTITY, DATE_REQUIRED, TRANSACTION_TYPE_ID,
          TRANSACTION_SOURCE_TYPE_ID, LINE_STATUS, STATUS_DATE, OPERATION, DB_FLAG, SOURCE_SYSTEM,
          IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, TO_DATE(:9, 'YYYY-MM-DD'), :10, :11, :12, TO_DATE(:13, 'YYYY-MM-DD'),
          'CREATE', 'T', :14, 'READY', SYSDATE, :15, SYSDATE, :16
        )
      `;

            const binds = [
                createDto.HEADER_IFACE_ID,
                createDto.LINE_NUMBER,
                createDto.ORGANIZATION_ID,
                createDto.INVENTORY_ITEM_ID,
                createDto.FROM_SUBINVENTORY_CODE,
                createDto.TO_SUBINVENTORY_CODE,
                createDto.UOM_CODE,
                createDto.QUANTITY,
                createDto.DATE_REQUIRED,
                createDto.TRANSACTION_TYPE_ID,
                createDto.TRANSACTION_SOURCE_TYPE_ID,
                createDto.LINE_STATUS,
                createDto.STATUS_DATE,
                userName,
                userId,
                userId
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
            this.logger.error('Error creating move order line:', error);
            throw new Error(`Failed to create move order line: ${error.message}`);
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

    async updateMoveOrderLine(
        lineIfaceId: number,
        updateDto: UpdateMoveOrderLineDto,
        userId: number = 1234,
    ): Promise<MoveOrderLineResponseDto> {
        try {
            const updateFields = [];
            const binds: any[] = [];

            if (updateDto.QUANTITY !== undefined) {
                updateFields.push('QUANTITY = ?');
                binds.push(updateDto.QUANTITY);
            }
            if (updateDto.LINE_STATUS !== undefined) {
                updateFields.push('LINE_STATUS = ?');
                binds.push(updateDto.LINE_STATUS);
            }

            if (updateFields.length === 0) {
                throw new Error('No fields to update');
            }

            updateFields.push('LAST_UPDATE_DATE = SYSDATE', 'LAST_UPDATED_BY = ?');
            binds.push(userId, lineIfaceId);

            const updateQuery = `
        UPDATE XTD_INV_MO_LINES_IFACE_V 
        SET ${updateFields.join(', ')}
        WHERE LINE_IFACE_ID = :1
      `;

            await this.oracleService.executeQuery(updateQuery, binds);
            return await this.getMoveOrderLineById(lineIfaceId);

        } catch (error) {
            this.logger.error('Error updating move order line:', error);
            throw new Error(`Failed to update move order line: ${error.message}`);
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

            const createdHeader = await this.createMoveOrder(createDto.header, userId, userName);
            this.logger.log(`Header created with ID: ${createdHeader.HEADER_IFACE_ID}`);

            for (let i = 0; i < createDto.lines.length; i++) {
                const lineDto = createDto.lines[i];
                try {
                    const fullLineDto: CreateMoveOrderLineDto = {
                        HEADER_IFACE_ID: createdHeader.HEADER_IFACE_ID,
                        LINE_NUMBER: lineDto.LINE_NUMBER,
                        ORGANIZATION_ID: lineDto.ORGANIZATION_ID,
                        INVENTORY_ITEM_ID: lineDto.INVENTORY_ITEM_ID,
                        REVISION: lineDto.REVISION,
                        FROM_SUBINVENTORY_ID: null,
                        FROM_SUBINVENTORY_CODE: lineDto.FROM_SUBINVENTORY_CODE,
                        FROM_LOCATOR_ID: lineDto.FROM_LOCATOR_ID,
                        TO_ORGANIZATION_ID: null,
                        TO_SUBINVENTORY_ID: null,
                        TO_SUBINVENTORY_CODE: lineDto.TO_SUBINVENTORY_CODE,
                        TO_LOCATOR_ID: lineDto.TO_LOCATOR_ID,
                        TO_ACCOUNT_ID: null,
                        LOT_NUMBER: lineDto.LOT_NUMBER,
                        SERIAL_NUMBER_START: lineDto.SERIAL_NUMBER_START,
                        SERIAL_NUMBER_END: lineDto.SERIAL_NUMBER_END,
                        UOM_CODE: lineDto.UOM_CODE,
                        QUANTITY: lineDto.QUANTITY,
                        QUANTITY_DELIVERED: null,
                        QUANTITY_DETAILED: null,
                        DATE_REQUIRED: lineDto.DATE_REQUIRED,
                        REASON_ID: null,
                        REFERENCE_ID: null,
                        REFERENCE: null,
                        REFERENCE_TYPE_CODE: null,
                        PROJECT_ID: null,
                        TASK_ID: null,
                        TRANSACTION_HEADER_ID: null,
                        TXN_SOURCE_ID: null,
                        TXN_SOURCE_LINE_ID: null,
                        TXN_SOURCE_LINE_DETAIL_ID: null,
                        TRANSACTION_TYPE_ID: lineDto.TRANSACTION_TYPE_ID,
                        TRANSACTION_SOURCE_TYPE_ID: lineDto.TRANSACTION_SOURCE_TYPE_ID,
                        PRIMARY_QUANTITY: null,
                        PUT_AWAY_STRATEGY_ID: null,
                        PICK_STRATEGY_ID: null,
                        UNIT_NUMBER: null,
                        SHIP_TO_LOCATION_ID: null,
                        FROM_COST_GROUP_ID: null,
                        TO_COST_GROUP_ID: null,
                        LPN_ID: null,
                        TO_LPN_ID: null,
                        PICK_METHODOLOGY_ID: null,
                        CONTAINER_ITEM_ID: null,
                        CARTON_GROUPING_ID: null,
                        LINE_STATUS: lineDto.LINE_STATUS,
                        STATUS_DATE: lineDto.STATUS_DATE,
                        INSPECTION_STATUS: null,
                        WMS_PROCESS_FLAG: null,
                        PICK_SLIP_NUMBER: null,
                        PICK_SLIP_DATE: null,
                        SHIP_SET_ID: null,
                        SHIP_MODEL_ID: null,
                        MODEL_QUANTITY: null,
                        REQUIRED_QUANTITY: null,
                        SECONDARY_UOM: null,
                        SECONDARY_QUANTITY: null,
                        SECONDARY_QUANTITY_DETAILED: null,
                        SECONDARY_QUANTITY_DELIVERED: null,
                        SECONDARY_REQUIRED_QUANTITY: null,
                        GRADE_CODE: null,
                        ATTRIBUTE_CATEGORY: null,
                        ATTRIBUTE1: null,
                        ATTRIBUTE2: null,
                        ATTRIBUTE3: null,
                        ATTRIBUTE4: null,
                        ATTRIBUTE5: null,
                        ATTRIBUTE6: null,
                        ATTRIBUTE7: null,
                        ATTRIBUTE8: null,
                        ATTRIBUTE9: null,
                        ATTRIBUTE10: null,
                        ATTRIBUTE11: null,
                        ATTRIBUTE12: null,
                        ATTRIBUTE13: null,
                        ATTRIBUTE14: null,
                        ATTRIBUTE15: null,
                        PROGRAM_APPLICATION_ID: null,
                        PROGRAM_ID: null,
                        PROGRAM_UPDATE_DATE: null,
                        SOURCE_HEADER_ID: lineDto.SOURCE_HEADER_ID,
                        SOURCE_LINE_ID: lineDto.SOURCE_LINE_ID,
                        SOURCE_BATCH_ID: lineDto.SOURCE_BATCH_ID,
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
                    totalLines: createDto.lines.length,
                    successfulLines,
                    failedLines,
                    errors: errors.length > 0 ? errors : undefined
                }
            };

            this.logger.log(`Move order creation completed. Header: ${createdHeader.HEADER_IFACE_ID}, Lines: ${successfulLines}/${createDto.lines.length} successful`);

            return response;

        } catch (error) {
            this.logger.error('Error creating move order with lines:', error);
            throw new Error(`Failed to create move order with lines: ${error.message}`);
        }
    }
}