import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
    CreateTrfReceiptDto,
    CreateTrfIssueDto,
    CreateReturnBadDto,
    CreateReturnGoodDto,
    CreateCorrectionDto,
    InvTransactionResponseDto,
} from '../dtos/inv-transaction.dtos';

@Injectable()
export class InvTransactionService {
    private readonly logger = new Logger(InvTransactionService.name);

    constructor(private readonly oracleService: OracleService) { }

    async createTrfReceipt(
        createDto: CreateTrfReceiptDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<InvTransactionResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_INV_MATERIAL_TRX_IFACE_V (
          SOURCE_CODE, SOURCE_LINE_ID, SOURCE_HEADER_ID, PROCESS_FLAG, TRANSACTION_MODE, LOCK_FLAG,
          INVENTORY_ITEM_ID, ORGANIZATION_ID, TRANSACTION_QUANTITY, TRANSACTION_UOM, TRANSACTION_DATE,
          SUBINVENTORY_CODE, LOCATOR_ID, TRANSACTION_SOURCE_NAME, TRANSACTION_TYPE_ID, TRANSACTION_REFERENCE,
          DISTRIBUTION_ACCOUNT_ID, ATTRIBUTE_CATEGORY, ATTRIBUTE13, ATTRIBUTE14, SOURCE_SYSTEM,
          SOURCE_HEADER_IFACE_ID, SOURCE_LINE_IFACE_ID, SOURCE_BATCH_IFACE_ID, IFACE_STATUS,
          CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, TO_DATE(:11, 'YYYY-MM-DD'), :12, :13, :14, :15,
          :16, :17, :18, :19, :20, :21, :22, :23, :24, 'READY', SYSDATE, :25, SYSDATE, :26
        )
      `;

            const binds = [
                createDto.SOURCE_CODE,                           // 1
                createDto.SOURCE_LINE_ID,                        // 2
                createDto.SOURCE_HEADER_ID,                      // 3
                createDto.PROCESS_FLAG,                          // 4
                createDto.TRANSACTION_MODE,                      // 5
                createDto.LOCK_FLAG,                             // 6
                createDto.INVENTORY_ITEM_ID,                     // 7
                createDto.ORGANIZATION_ID,                       // 8
                createDto.TRANSACTION_QUANTITY,                  // 9
                createDto.TRANSACTION_UOM,                       // 10
                createDto.TRANSACTION_DATE,                      // 11 - TO_DATE
                createDto.SUBINVENTORY_CODE,                     // 12
                createDto.LOCATOR_ID,                            // 13
                createDto.TRANSACTION_SOURCE_NAME,               // 14
                createDto.TRANSACTION_TYPE_ID,                   // 15
                createDto.TRANSACTION_REFERENCE,                 // 16
                createDto.DISTRIBUTION_ACCOUNT_ID,               // 17
                createDto.ATTRIBUTE_CATEGORY,                    // 18
                createDto.ATTRIBUTE13 || null,                   // 19
                createDto.ATTRIBUTE14 || null,                   // 20
                createDto.SOURCE_SYSTEM,                         // 21
                createDto.SOURCE_HEADER_IFACE_ID,                // 22
                createDto.SOURCE_LINE_IFACE_ID,                  // 23
                createDto.SOURCE_BATCH_IFACE_ID,                 // 24
                userId,                                          // 25 - CREATED_BY
                userId                                           // 26 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            return await this.getTransactionBySourceIds(
                createDto.SOURCE_HEADER_IFACE_ID,
                createDto.SOURCE_LINE_IFACE_ID,
                createDto.SOURCE_SYSTEM
            );

        } catch (error) {
            this.logger.error('Error creating transfer receipt transaction:', error);
            throw new Error(`Failed to create transfer receipt transaction: ${error.message}`);
        }
    }

    async createTrfIssue(
        createDto: CreateTrfIssueDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<InvTransactionResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_INV_MATERIAL_TRX_IFACE_V (
          SOURCE_CODE, SOURCE_LINE_ID, SOURCE_HEADER_ID, PROCESS_FLAG, TRANSACTION_MODE, LOCK_FLAG,
          INVENTORY_ITEM_ID, ORGANIZATION_ID, TRANSACTION_QUANTITY, TRANSACTION_UOM, TRANSACTION_DATE,
          SUBINVENTORY_CODE, LOCATOR_ID, TRANSACTION_SOURCE_NAME, TRANSACTION_TYPE_ID, TRANSACTION_REFERENCE,
          DISTRIBUTION_ACCOUNT_ID, ATTRIBUTE_CATEGORY, ATTRIBUTE13, ATTRIBUTE14, SOURCE_SYSTEM,
          SOURCE_HEADER_IFACE_ID, SOURCE_LINE_IFACE_ID, SOURCE_BATCH_IFACE_ID, IFACE_STATUS,
          CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, TO_DATE(:11, 'YYYY-MM-DD'), :12, :13, :14, :15,
          :16, :17, :18, :19, :20, :21, :22, :23, :24, 'READY', SYSDATE, :25, SYSDATE, :26
        )
      `;

            const binds = [
                createDto.SOURCE_CODE,                           // 1
                createDto.SOURCE_LINE_ID,                        // 2
                createDto.SOURCE_HEADER_ID,                      // 3
                createDto.PROCESS_FLAG,                          // 4
                createDto.TRANSACTION_MODE,                      // 5
                createDto.LOCK_FLAG,                             // 6
                createDto.INVENTORY_ITEM_ID,                     // 7
                createDto.ORGANIZATION_ID,                       // 8
                createDto.TRANSACTION_QUANTITY,                  // 9 (should be negative for issue)
                createDto.TRANSACTION_UOM,                       // 10
                createDto.TRANSACTION_DATE,                      // 11 - TO_DATE
                createDto.SUBINVENTORY_CODE,                     // 12
                createDto.LOCATOR_ID,                            // 13
                createDto.TRANSACTION_SOURCE_NAME,               // 14
                createDto.TRANSACTION_TYPE_ID,                   // 15
                createDto.TRANSACTION_REFERENCE,                 // 16
                createDto.DISTRIBUTION_ACCOUNT_ID,               // 17
                createDto.ATTRIBUTE_CATEGORY,                    // 18
                createDto.ATTRIBUTE13 || null,                   // 19
                createDto.ATTRIBUTE14 || null,                   // 20
                createDto.SOURCE_SYSTEM,                         // 21
                createDto.SOURCE_HEADER_IFACE_ID,                // 22
                createDto.SOURCE_LINE_IFACE_ID,                  // 23
                createDto.SOURCE_BATCH_IFACE_ID,                 // 24
                userId,                                          // 25 - CREATED_BY
                userId                                           // 26 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            return await this.getTransactionBySourceIds(
                createDto.SOURCE_HEADER_IFACE_ID,
                createDto.SOURCE_LINE_IFACE_ID,
                createDto.SOURCE_SYSTEM
            );

        } catch (error) {
            this.logger.error('Error creating transfer issue transaction:', error);
            throw new Error(`Failed to create transfer issue transaction: ${error.message}`);
        }
    }

    async createReturnBad(
        createDto: CreateReturnBadDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<InvTransactionResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_INV_MATERIAL_TRX_IFACE_V (
          SOURCE_CODE, SOURCE_LINE_ID, SOURCE_HEADER_ID, PROCESS_FLAG, TRANSACTION_MODE, LOCK_FLAG,
          INVENTORY_ITEM_ID, ORGANIZATION_ID, TRANSACTION_QUANTITY, TRANSACTION_UOM, TRANSACTION_DATE,
          SUBINVENTORY_CODE, LOCATOR_ID, TRANSACTION_SOURCE_NAME, TRANSACTION_TYPE_ID, TRANSACTION_REFERENCE,
          TRANSFER_SUBINVENTORY, TRANSFER_ORGANIZATION, TRANSFER_LOCATOR, ATTRIBUTE_CATEGORY,
          ATTRIBUTE6, ATTRIBUTE7, ATTRIBUTE10, ATTRIBUTE13, ATTRIBUTE14, SOURCE_SYSTEM,
          SOURCE_HEADER_IFACE_ID, SOURCE_LINE_IFACE_ID, SOURCE_BATCH_IFACE_ID, IFACE_STATUS,
          CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, TO_DATE(:11, 'YYYY-MM-DD'), :12, :13, :14, :15,
          :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, 'READY',
          SYSDATE, :30, SYSDATE, :31
        )
      `;

            const binds = [
                createDto.SOURCE_CODE,                           // 1
                createDto.SOURCE_LINE_ID,                        // 2
                createDto.SOURCE_HEADER_ID,                      // 3
                createDto.PROCESS_FLAG,                          // 4
                createDto.TRANSACTION_MODE,                      // 5
                createDto.LOCK_FLAG,                             // 6
                createDto.INVENTORY_ITEM_ID,                     // 7
                createDto.ORGANIZATION_ID,                       // 8
                createDto.TRANSACTION_QUANTITY,                  // 9
                createDto.TRANSACTION_UOM,                       // 10
                createDto.TRANSACTION_DATE,                      // 11 - TO_DATE
                createDto.SUBINVENTORY_CODE,                     // 12
                createDto.LOCATOR_ID,                            // 13
                createDto.TRANSACTION_SOURCE_NAME,               // 14
                createDto.TRANSACTION_TYPE_ID,                   // 15
                createDto.TRANSACTION_REFERENCE,                 // 16
                createDto.TRANSFER_SUBINVENTORY,                 // 17
                createDto.TRANSFER_ORGANIZATION,                 // 18
                createDto.TRANSFER_LOCATOR,                      // 19
                createDto.ATTRIBUTE_CATEGORY,                    // 20
                createDto.ATTRIBUTE6 || null,                    // 21
                createDto.ATTRIBUTE7 || null,                    // 22
                createDto.ATTRIBUTE10 || null,                   // 23
                createDto.ATTRIBUTE13 || null,                   // 24
                createDto.ATTRIBUTE14 || null,                   // 25
                createDto.SOURCE_SYSTEM,                         // 26
                createDto.SOURCE_HEADER_IFACE_ID,                // 27
                createDto.SOURCE_LINE_IFACE_ID,                  // 28
                createDto.SOURCE_BATCH_IFACE_ID,                 // 29
                userId,                                          // 30 - CREATED_BY
                userId                                           // 31 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            return await this.getTransactionBySourceIds(
                createDto.SOURCE_HEADER_IFACE_ID,
                createDto.SOURCE_LINE_IFACE_ID,
                createDto.SOURCE_SYSTEM
            );

        } catch (error) {
            this.logger.error('Error creating return bad transaction:', error);
            throw new Error(`Failed to create return bad transaction: ${error.message}`);
        }
    }

    async createReturnGood(
        createDto: CreateReturnGoodDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<InvTransactionResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_INV_MATERIAL_TRX_IFACE_V (
          SOURCE_CODE, SOURCE_LINE_ID, SOURCE_HEADER_ID, PROCESS_FLAG, TRANSACTION_MODE, LOCK_FLAG,
          INVENTORY_ITEM_ID, ORGANIZATION_ID, TRANSACTION_QUANTITY, TRANSACTION_UOM, TRANSACTION_DATE,
          SUBINVENTORY_CODE, LOCATOR_ID, TRANSACTION_SOURCE_NAME, TRANSACTION_TYPE_ID, TRANSACTION_REFERENCE,
          TRANSFER_SUBINVENTORY, TRANSFER_ORGANIZATION, TRANSFER_LOCATOR, ATTRIBUTE_CATEGORY,
          ATTRIBUTE13, ATTRIBUTE14, SOURCE_SYSTEM, SOURCE_HEADER_IFACE_ID, SOURCE_LINE_IFACE_ID,
          SOURCE_BATCH_IFACE_ID, IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, TO_DATE(:11, 'YYYY-MM-DD'), :12, :13, :14, :15,
          :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, 'READY', SYSDATE, :27, SYSDATE, :28
        )
      `;

            const binds = [
                createDto.SOURCE_CODE,                           // 1
                createDto.SOURCE_LINE_ID,                        // 2
                createDto.SOURCE_HEADER_ID,                      // 3
                createDto.PROCESS_FLAG,                          // 4
                createDto.TRANSACTION_MODE,                      // 5
                createDto.LOCK_FLAG,                             // 6
                createDto.INVENTORY_ITEM_ID,                     // 7
                createDto.ORGANIZATION_ID,                       // 8
                createDto.TRANSACTION_QUANTITY,                  // 9
                createDto.TRANSACTION_UOM,                       // 10
                createDto.TRANSACTION_DATE,                      // 11 - TO_DATE
                createDto.SUBINVENTORY_CODE,                     // 12
                createDto.LOCATOR_ID,                            // 13
                createDto.TRANSACTION_SOURCE_NAME,               // 14
                createDto.TRANSACTION_TYPE_ID,                   // 15
                createDto.TRANSACTION_REFERENCE,                 // 16
                createDto.TRANSFER_SUBINVENTORY,                 // 17
                createDto.TRANSFER_ORGANIZATION,                 // 18
                createDto.TRANSFER_LOCATOR,                      // 19
                createDto.ATTRIBUTE_CATEGORY,                    // 20
                createDto.ATTRIBUTE13 || null,                   // 21
                createDto.ATTRIBUTE14 || null,                   // 22
                createDto.SOURCE_SYSTEM,                         // 23
                createDto.SOURCE_HEADER_IFACE_ID,                // 24
                createDto.SOURCE_LINE_IFACE_ID,                  // 25
                createDto.SOURCE_BATCH_IFACE_ID,                 // 26
                userId,                                          // 27 - CREATED_BY
                userId                                           // 28 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            return await this.getTransactionBySourceIds(
                createDto.SOURCE_HEADER_IFACE_ID,
                createDto.SOURCE_LINE_IFACE_ID,
                createDto.SOURCE_SYSTEM
            );

        } catch (error) {
            this.logger.error('Error creating return good transaction:', error);
            throw new Error(`Failed to create return good transaction: ${error.message}`);
        }
    }

    async createCorrection(
        createDto: CreateCorrectionDto,
        userId: number = 1234,
        userName: string = 'DMS',
    ): Promise<InvTransactionResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_INV_MATERIAL_TRX_IFACE_V (
          SOURCE_CODE, SOURCE_LINE_ID, SOURCE_HEADER_ID, PROCESS_FLAG, TRANSACTION_MODE, LOCK_FLAG,
          INVENTORY_ITEM_ID, ORGANIZATION_ID, TRANSACTION_QUANTITY, TRANSACTION_UOM, TRANSACTION_DATE,
          SUBINVENTORY_CODE, LOCATOR_ID, TRANSACTION_SOURCE_NAME, TRANSACTION_TYPE_ID, TRANSACTION_REFERENCE,
          TRANSFER_SUBINVENTORY, TRANSFER_ORGANIZATION, TRANSFER_LOCATOR, ATTRIBUTE_CATEGORY,
          ATTRIBUTE13, ATTRIBUTE14, SOURCE_SYSTEM, SOURCE_HEADER_IFACE_ID, SOURCE_LINE_IFACE_ID,
          SOURCE_BATCH_IFACE_ID, IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, TO_DATE(:11, 'YYYY-MM-DD'), :12, :13, :14, :15,
          :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, 'READY', SYSDATE, :27, SYSDATE, :28
        )
      `;

            const binds = [
                createDto.SOURCE_CODE,                           // 1
                createDto.SOURCE_LINE_ID,                        // 2
                createDto.SOURCE_HEADER_ID,                      // 3
                createDto.PROCESS_FLAG,                          // 4
                createDto.TRANSACTION_MODE,                      // 5
                createDto.LOCK_FLAG,                             // 6
                createDto.INVENTORY_ITEM_ID,                     // 7
                createDto.ORGANIZATION_ID,                       // 8
                createDto.TRANSACTION_QUANTITY,                  // 9 (should be negative for correction)
                createDto.TRANSACTION_UOM,                       // 10
                createDto.TRANSACTION_DATE,                      // 11 - TO_DATE
                createDto.SUBINVENTORY_CODE,                     // 12
                createDto.LOCATOR_ID,                            // 13
                createDto.TRANSACTION_SOURCE_NAME,               // 14
                createDto.TRANSACTION_TYPE_ID,                   // 15
                createDto.TRANSACTION_REFERENCE,                 // 16
                createDto.TRANSFER_SUBINVENTORY,                 // 17
                createDto.TRANSFER_ORGANIZATION,                 // 18
                createDto.TRANSFER_LOCATOR,                      // 19
                createDto.ATTRIBUTE_CATEGORY,                    // 20
                createDto.ATTRIBUTE13 || null,                   // 21
                createDto.ATTRIBUTE14 || null,                   // 22
                createDto.SOURCE_SYSTEM,                         // 23
                createDto.SOURCE_HEADER_IFACE_ID,                // 24
                createDto.SOURCE_LINE_IFACE_ID,                  // 25
                createDto.SOURCE_BATCH_IFACE_ID,                 // 26
                userId,                                          // 27 - CREATED_BY
                userId                                           // 28 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, binds);

            return await this.getTransactionBySourceIds(
                createDto.SOURCE_HEADER_IFACE_ID,
                createDto.SOURCE_LINE_IFACE_ID,
                createDto.SOURCE_SYSTEM
            );

        } catch (error) {
            this.logger.error('Error creating correction transaction:', error);
            throw new Error(`Failed to create correction transaction: ${error.message}`);
        }
    }

    private async getTransactionBySourceIds(
        sourceHeaderIfaceId: string,
        sourceLineIfaceId: string,
        sourceSystem: string
    ): Promise<InvTransactionResponseDto> {
        const selectQuery = `
        SELECT SOURCE_CODE, SOURCE_LINE_ID, SOURCE_HEADER_ID, PROCESS_FLAG, TRANSACTION_MODE, LOCK_FLAG,
               INVENTORY_ITEM_ID, ORGANIZATION_ID, TRANSACTION_QUANTITY, TRANSACTION_UOM, TRANSACTION_DATE,
               SUBINVENTORY_CODE, LOCATOR_ID, TRANSACTION_SOURCE_NAME, TRANSACTION_TYPE_ID, TRANSACTION_REFERENCE,
               DISTRIBUTION_ACCOUNT_ID, TRANSFER_SUBINVENTORY, TRANSFER_ORGANIZATION, TRANSFER_LOCATOR,
               ATTRIBUTE_CATEGORY, ATTRIBUTE6, ATTRIBUTE7, ATTRIBUTE10, ATTRIBUTE13, ATTRIBUTE14,
               SOURCE_SYSTEM, SOURCE_HEADER_IFACE_ID, SOURCE_LINE_IFACE_ID, SOURCE_BATCH_IFACE_ID,
               IFACE_STATUS, CREATION_DATE, CREATED_BY, LAST_UPDATE_DATE, LAST_UPDATED_BY
        FROM XTD_INV_MATERIAL_TRX_IFACE_V
        WHERE SOURCE_HEADER_IFACE_ID = :1 AND SOURCE_LINE_IFACE_ID = :2 AND SOURCE_SYSTEM = :3
        ORDER BY CREATION_DATE DESC
        FETCH FIRST 1 ROW ONLY
      `;

        const result = await this.oracleService.executeQuery(selectQuery, [
            sourceHeaderIfaceId,
            sourceLineIfaceId,
            sourceSystem
        ]);

        if (result.rows.length === 0) {
            throw new Error('Failed to retrieve created inventory transaction');
        }

        const row = result.rows[0];
        return {
            SOURCE_CODE: row.SOURCE_CODE,
            SOURCE_LINE_ID: row.SOURCE_LINE_ID,
            SOURCE_HEADER_ID: row.SOURCE_HEADER_ID,
            PROCESS_FLAG: row.PROCESS_FLAG,
            TRANSACTION_MODE: row.TRANSACTION_MODE,
            LOCK_FLAG: row.LOCK_FLAG,
            INVENTORY_ITEM_ID: row.INVENTORY_ITEM_ID,
            ORGANIZATION_ID: row.ORGANIZATION_ID,
            TRANSACTION_QUANTITY: row.TRANSACTION_QUANTITY,
            TRANSACTION_UOM: row.TRANSACTION_UOM,
            TRANSACTION_DATE: row.TRANSACTION_DATE,
            SUBINVENTORY_CODE: row.SUBINVENTORY_CODE,
            LOCATOR_ID: row.LOCATOR_ID,
            TRANSACTION_SOURCE_NAME: row.TRANSACTION_SOURCE_NAME,
            TRANSACTION_TYPE_ID: row.TRANSACTION_TYPE_ID,
            TRANSACTION_REFERENCE: row.TRANSACTION_REFERENCE,
            DISTRIBUTION_ACCOUNT_ID: row.DISTRIBUTION_ACCOUNT_ID || null,
            TRANSFER_SUBINVENTORY: row.TRANSFER_SUBINVENTORY || null,
            TRANSFER_ORGANIZATION: row.TRANSFER_ORGANIZATION || null,
            TRANSFER_LOCATOR: row.TRANSFER_LOCATOR || null,
            ATTRIBUTE_CATEGORY: row.ATTRIBUTE_CATEGORY,
            ATTRIBUTE6: row.ATTRIBUTE6 || '',
            ATTRIBUTE7: row.ATTRIBUTE7 || '',
            ATTRIBUTE10: row.ATTRIBUTE10 || '',
            ATTRIBUTE13: row.ATTRIBUTE13 || '',
            ATTRIBUTE14: row.ATTRIBUTE14 || '',
            SOURCE_SYSTEM: row.SOURCE_SYSTEM,
            SOURCE_HEADER_IFACE_ID: row.SOURCE_HEADER_IFACE_ID,
            SOURCE_LINE_IFACE_ID: row.SOURCE_LINE_IFACE_ID,
            SOURCE_BATCH_IFACE_ID: row.SOURCE_BATCH_IFACE_ID,
            IFACE_STATUS: row.IFACE_STATUS,
            CREATION_DATE: row.CREATION_DATE,
            CREATED_BY: row.CREATED_BY,
            LAST_UPDATE_DATE: row.LAST_UPDATE_DATE,
            LAST_UPDATED_BY: row.LAST_UPDATED_BY
        };
    }
}
