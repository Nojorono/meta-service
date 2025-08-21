import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
    CreateArReceiptDto,
    ArReceiptResponseDto,
} from '../dtos/ar-receipts.dtos';

@Injectable()
export class ArReceiptsService {
    private readonly logger = new Logger(ArReceiptsService.name);

    constructor(private readonly oracleService: OracleService) { }

    async createArReceipt(
        createDto: CreateArReceiptDto,
    ): Promise<ArReceiptResponseDto> {
        try {
            const insertQuery = `
        INSERT INTO XTD_AR_RECEIPTS_IFACE_V (
          SOURCE_SYSTEM,
          RECEIPT_NUMBER,
          RECEIPT_DATE,
          GL_DATE,
          AMOUNT,
          FACTOR_DISCOUNT_AMOUNT,
          CUSTOMER_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          USR_CURRENCY_CODE,
          CURRENCY_CODE,
          CUSTOMER_BANK_ACCOUNT_ID,
          CUSTOMER_BANK_ACCOUNT_NUM,
          CUSTOMER_BANK_ACCOUNT_NAME,
          USR_EXCHANGE_RATE_TYPE,
          EXCHANGE_RATE_TYPE,
          EXCHANGE_RATE,
          EXCHANGE_DATE,
          ACTIVITY,
          MISC_PAYMENT_SOURCE,
          LOCATION,
          TAX_CODE,
          VAT_TAX_ID,
          TAX_RATE,
          TAX_AMOUNT,
          CUSTOMER_SITE_USE_ID,
          CUSTOMER_RECEIPT_REFERENCE,
          RECEIPT_METHOD_ID,
          RECEIPT_METHOD_NAME,
          REFERENCE_TYPE,
          REFERENCE_NUM,
          REFERENCE_ID,
          OVERRIDE_REMIT_ACCOUNT_FLAG,
          REMITTENCE_BANK_ACCOUNT_ID,
          REMITTENCE_BANK_ACCOUNT_NUM,
          REMITTENCE_BANK_ACCOUNT_NAME,
          DOC_SEQUENCE_VALUE,
          MATURITY_DATE,
          DEPOSIT_DATE,
          USSGL_TRANSACTION_CODE,
          ANTICPATED_CLEARING_DATE,
          ATTRIBUTE_CATEGORY,
          ATTRIBUTE1,
          ATTRIBUTE2,
          ATTRIBUTE3,
          ATTRIBUTE4,
          ATTRIBUTE5,
          ATTRIBUTE6,
          ATTRIBUTE7,
          ATTRIBUTE8,
          ATTRIBUTE9,
          ATTRIBUTE10,
          ATTRIBUTE11,
          ATTRIBUTE12,
          ATTRIBUTE13,
          ATTRIBUTE14,
          GLOBAL_ATTRIBUTE1,
          GLOBAL_ATTRIBUTE2,
          GLOBAL_ATTRIBUTE3,
          GLOBAL_ATTRIBUTE4,
          GLOBAL_ATTRIBUTE5,
          GLOBAL_ATTRIBUTE6,
          GLOBAL_ATTRIBUTE7,
          GLOBAL_ATTRIBUTE8,
          GLOBAL_ATTRIBUTE9,
          GLOBAL_ATTRIBUTE10,
          GLOBAL_ATTRIBUTE11,
          GLOBAL_ATTRIBUTE12,
          GLOBAL_ATTRIBUTE13,
          GLOBAL_ATTRIBUTE14,
          GLOBAL_ATTRIBUTE15,
          ISSUER_NAME,
          ISSUE_DATE,
          ISSUER_BANK_BRANCH_ID,
          INSTALLMENT,
          CALLED_FROM,
          CASH_RECEIPT_ID,
          COMMENTS,
          IFACE_MODE,
          GROUP_ID,
          REQUEST_ID,
          ORG_NAME,
          ORG_ID,
          SOURCE_HEADER_ID,
          SOURCE_LINE_ID,
          SOURCE_BATCH_ID,
          IFACE_STATUS,
          IFACE_MESSAGE,
          LAST_UPDATE_LOGIN,
          CREATION_DATE,
          CREATED_BY,
          LAST_UPDATE_DATE,
          LAST_UPDATED_BY
        ) VALUES (
          :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18, :19, :20, :21, :22, :23, :24, :25, :26, :27, :28, :29, :30, :31, :32, :33, :34, :35, :36, :37, :38, :39, :40, :41, :42, :43, :44, :45, :46, :47, :48, :49, :50, :51, :52, :53, :54, :55, :56, :57, :58, :59, :60, :61, :62, :63, :64, :65, :66, :67, :68, :69, :70, :71, :72, :73, :74, :75, :76, :77, :78, :79, :80, :81, :82, :83, :84, :85, :86, :87, :88, :89, SYSDATE, :90, SYSDATE, :91
        )
      `;

            const insertParams = [
                createDto.SOURCE_SYSTEM || null,                // :1
                createDto.RECEIPT_NUMBER,                       // :2
                new Date(createDto.RECEIPT_DATE),               // :3
                new Date(createDto.GL_DATE),                    // :4
                createDto.AMOUNT,                               // :5
                createDto.FACTOR_DISCOUNT_AMOUNT || null,       // :6
                createDto.CUSTOMER_ID,                          // :7
                createDto.CUSTOMER_NAME,                        // :8
                createDto.CUSTOMER_NUMBER,                      // :9
                createDto.USR_CURRENCY_CODE || null,            // :10
                createDto.CURRENCY_CODE,                        // :11
                createDto.CUSTOMER_BANK_ACCOUNT_ID || null,     // :12
                createDto.CUSTOMER_BANK_ACCOUNT_NUM || null,    // :13
                createDto.CUSTOMER_BANK_ACCOUNT_NAME || null,   // :14
                createDto.USR_EXCHANGE_RATE_TYPE || null,       // :15
                createDto.EXCHANGE_RATE_TYPE || null,           // :16
                createDto.EXCHANGE_RATE || null,                // :17
                createDto.EXCHANGE_DATE ? new Date(createDto.EXCHANGE_DATE) : null, // :18
                createDto.ACTIVITY || null,                     // :19
                createDto.MISC_PAYMENT_SOURCE || null,          // :20
                createDto.LOCATION || null,                     // :21
                createDto.TAX_CODE || null,                     // :22
                createDto.VAT_TAX_ID || null,                   // :23
                createDto.TAX_RATE || null,                     // :24
                createDto.TAX_AMOUNT || null,                   // :25
                createDto.CUSTOMER_SITE_USE_ID || null,         // :26
                createDto.CUSTOMER_RECEIPT_REFERENCE || null,   // :27
                createDto.RECEIPT_METHOD_ID,                    // :28
                createDto.RECEIPT_METHOD_NAME,                  // :29
                createDto.REFERENCE_TYPE || null,               // :30
                createDto.REFERENCE_NUM || null,                // :31
                createDto.REFERENCE_ID || null,                 // :32
                createDto.OVERRIDE_REMIT_ACCOUNT_FLAG || null,  // :33
                createDto.REMITTENCE_BANK_ACCOUNT_ID,           // :34
                createDto.REMITTENCE_BANK_ACCOUNT_NUM,          // :35
                createDto.REMITTENCE_BANK_ACCOUNT_NAME,         // :36
                createDto.DOC_SEQUENCE_VALUE || null,           // :37
                new Date(createDto.MATURITY_DATE),              // :38
                createDto.DEPOSIT_DATE ? new Date(createDto.DEPOSIT_DATE) : null, // :39
                createDto.USSGL_TRANSACTION_CODE || null,       // :40
                createDto.ANTICPATED_CLEARING_DATE ? new Date(createDto.ANTICPATED_CLEARING_DATE) : null, // :41
                createDto.ATTRIBUTE_CATEGORY,                   // :42
                createDto.ATTRIBUTE1 || null,                   // :43
                createDto.ATTRIBUTE2 || null,                   // :44
                createDto.ATTRIBUTE3 || null,                   // :45
                createDto.ATTRIBUTE4 || null,                   // :46
                createDto.ATTRIBUTE5 || null,                   // :47
                createDto.ATTRIBUTE6 || null,                   // :48
                createDto.ATTRIBUTE7 || null,                   // :49
                createDto.ATTRIBUTE8 || null,                   // :50
                createDto.ATTRIBUTE9 || null,                   // :51
                createDto.ATTRIBUTE10,                          // :52
                createDto.ATTRIBUTE11,                          // :53
                createDto.ATTRIBUTE12,                          // :54
                createDto.ATTRIBUTE13,                          // :55
                createDto.ATTRIBUTE14,                          // :56
                createDto.GLOBAL_ATTRIBUTE1 || null,            // :57
                createDto.GLOBAL_ATTRIBUTE2 || null,            // :58
                createDto.GLOBAL_ATTRIBUTE3 || null,            // :59
                createDto.GLOBAL_ATTRIBUTE4 || null,            // :60
                createDto.GLOBAL_ATTRIBUTE5 || null,            // :61
                createDto.GLOBAL_ATTRIBUTE6 || null,            // :62
                createDto.GLOBAL_ATTRIBUTE7 || null,            // :63
                createDto.GLOBAL_ATTRIBUTE8 || null,            // :64
                createDto.GLOBAL_ATTRIBUTE9 || null,            // :65
                createDto.GLOBAL_ATTRIBUTE10 || null,           // :66
                createDto.GLOBAL_ATTRIBUTE11 || null,           // :67
                createDto.GLOBAL_ATTRIBUTE12 || null,           // :68
                createDto.GLOBAL_ATTRIBUTE13 || null,           // :69
                createDto.GLOBAL_ATTRIBUTE14 || null,           // :70
                createDto.GLOBAL_ATTRIBUTE15 || null,           // :71
                createDto.ISSUER_NAME || null,                  // :72
                createDto.ISSUE_DATE ? new Date(createDto.ISSUE_DATE) : null, // :73
                createDto.ISSUER_BANK_BRANCH_ID || null,        // :74
                createDto.INSTALLMENT || null,                  // :75
                createDto.CALLED_FROM || null,                  // :76
                createDto.CASH_RECEIPT_ID || null,              // :77
                createDto.COMMENTS || null,                     // :78
                createDto.IFACE_MODE,                           // :79
                createDto.GROUP_ID || null,                     // :80
                createDto.REQUEST_ID || null,                   // :81
                createDto.ORG_NAME,                             // :82
                createDto.ORG_ID,                               // :83
                createDto.SOURCE_HEADER_ID,                     // :84
                createDto.SOURCE_LINE_ID,                       // :85
                createDto.SOURCE_BATCH_ID,                      // :86
                createDto.IFACE_STATUS,                         // :87
                createDto.IFACE_MESSAGE || null,                // :88
                createDto.LAST_UPDATE_LOGIN || null,            // :89
                1,                                              // :90 - CREATED_BY
                1,                                              // :91 - LAST_UPDATED_BY
            ];

            await this.oracleService.executeQuery(insertQuery, insertParams);

            const selectQuery = `
        SELECT
          IFACE_ID,
          SOURCE_SYSTEM,
          RECEIPT_NUMBER,
          RECEIPT_DATE,
          GL_DATE,
          AMOUNT,
          FACTOR_DISCOUNT_AMOUNT,
          CUSTOMER_ID,
          CUSTOMER_NAME,
          CUSTOMER_NUMBER,
          USR_CURRENCY_CODE,
          CURRENCY_CODE,
          CUSTOMER_BANK_ACCOUNT_ID,
          CUSTOMER_BANK_ACCOUNT_NUM,
          CUSTOMER_BANK_ACCOUNT_NAME,
          USR_EXCHANGE_RATE_TYPE,
          EXCHANGE_RATE_TYPE,
          EXCHANGE_RATE,
          EXCHANGE_DATE,
          ACTIVITY,
          MISC_PAYMENT_SOURCE,
          LOCATION,
          TAX_CODE,
          VAT_TAX_ID,
          TAX_RATE,
          TAX_AMOUNT,
          CUSTOMER_SITE_USE_ID,
          CUSTOMER_RECEIPT_REFERENCE,
          RECEIPT_METHOD_ID,
          RECEIPT_METHOD_NAME,
          REFERENCE_TYPE,
          REFERENCE_NUM,
          REFERENCE_ID,
          OVERRIDE_REMIT_ACCOUNT_FLAG,
          REMITTENCE_BANK_ACCOUNT_ID,
          REMITTENCE_BANK_ACCOUNT_NUM,
          REMITTENCE_BANK_ACCOUNT_NAME,
          DOC_SEQUENCE_VALUE,
          MATURITY_DATE,
          DEPOSIT_DATE,
          USSGL_TRANSACTION_CODE,
          ANTICPATED_CLEARING_DATE,
          ATTRIBUTE_CATEGORY,
          ATTRIBUTE1,
          ATTRIBUTE2,
          ATTRIBUTE3,
          ATTRIBUTE4,
          ATTRIBUTE5,
          ATTRIBUTE6,
          ATTRIBUTE7,
          ATTRIBUTE8,
          ATTRIBUTE9,
          ATTRIBUTE10,
          ATTRIBUTE11,
          ATTRIBUTE12,
          ATTRIBUTE13,
          ATTRIBUTE14,
          GLOBAL_ATTRIBUTE1,
          GLOBAL_ATTRIBUTE2,
          GLOBAL_ATTRIBUTE3,
          GLOBAL_ATTRIBUTE4,
          GLOBAL_ATTRIBUTE5,
          GLOBAL_ATTRIBUTE6,
          GLOBAL_ATTRIBUTE7,
          GLOBAL_ATTRIBUTE8,
          GLOBAL_ATTRIBUTE9,
          GLOBAL_ATTRIBUTE10,
          GLOBAL_ATTRIBUTE11,
          GLOBAL_ATTRIBUTE12,
          GLOBAL_ATTRIBUTE13,
          GLOBAL_ATTRIBUTE14,
          GLOBAL_ATTRIBUTE15,
          ISSUER_NAME,
          ISSUE_DATE,
          ISSUER_BANK_BRANCH_ID,
          INSTALLMENT,
          CALLED_FROM,
          CASH_RECEIPT_ID,
          COMMENTS,
          IFACE_MODE,
          GROUP_ID,
          REQUEST_ID,
          ORG_NAME,
          ORG_ID,
          SOURCE_HEADER_ID,
          SOURCE_LINE_ID,
          SOURCE_BATCH_ID,
          IFACE_STATUS,
          IFACE_MESSAGE,
          CREATION_DATE,
          CREATED_BY,
          LAST_UPDATE_LOGIN,
          LAST_UPDATE_DATE,
          LAST_UPDATED_BY
        FROM XTD_AR_RECEIPTS_IFACE_V
        WHERE RECEIPT_NUMBER = :1
        AND SOURCE_BATCH_ID = :2
        AND SOURCE_HEADER_ID = :3
        AND SOURCE_LINE_ID = :4
        ORDER BY IFACE_ID DESC
        FETCH FIRST 1 ROW ONLY
      `;

            const selectParams = [
                createDto.RECEIPT_NUMBER,
                createDto.SOURCE_BATCH_ID,
                createDto.SOURCE_HEADER_ID,
                createDto.SOURCE_LINE_ID,
            ];

            const result = await this.oracleService.executeQuery(
                selectQuery,
                selectParams,
            );

            if (result.rows.length === 0) {
                throw new Error('Failed to retrieve created AR Receipt');
            }

            const createdRecord = result.rows[0];
            this.logger.log(
                `Created AR Receipt with ID: ${createdRecord.IFACE_ID}`,
            );

            const response: ArReceiptResponseDto = {
                IFACE_ID: createdRecord.IFACE_ID,
                SOURCE_SYSTEM: createdRecord.SOURCE_SYSTEM,
                RECEIPT_NUMBER: createdRecord.RECEIPT_NUMBER,
                RECEIPT_DATE: createdRecord.RECEIPT_DATE,
                GL_DATE: createdRecord.GL_DATE,
                AMOUNT: createdRecord.AMOUNT,
                FACTOR_DISCOUNT_AMOUNT: createdRecord.FACTOR_DISCOUNT_AMOUNT,
                CUSTOMER_ID: createdRecord.CUSTOMER_ID,
                CUSTOMER_NAME: createdRecord.CUSTOMER_NAME,
                CUSTOMER_NUMBER: createdRecord.CUSTOMER_NUMBER,
                USR_CURRENCY_CODE: createdRecord.USR_CURRENCY_CODE,
                CURRENCY_CODE: createdRecord.CURRENCY_CODE,
                CUSTOMER_BANK_ACCOUNT_ID: createdRecord.CUSTOMER_BANK_ACCOUNT_ID,
                CUSTOMER_BANK_ACCOUNT_NUM: createdRecord.CUSTOMER_BANK_ACCOUNT_NUM,
                CUSTOMER_BANK_ACCOUNT_NAME: createdRecord.CUSTOMER_BANK_ACCOUNT_NAME,
                USR_EXCHANGE_RATE_TYPE: createdRecord.USR_EXCHANGE_RATE_TYPE,
                EXCHANGE_RATE_TYPE: createdRecord.EXCHANGE_RATE_TYPE,
                EXCHANGE_RATE: createdRecord.EXCHANGE_RATE,
                EXCHANGE_DATE: createdRecord.EXCHANGE_DATE,
                ACTIVITY: createdRecord.ACTIVITY,
                MISC_PAYMENT_SOURCE: createdRecord.MISC_PAYMENT_SOURCE,
                LOCATION: createdRecord.LOCATION,
                TAX_CODE: createdRecord.TAX_CODE,
                VAT_TAX_ID: createdRecord.VAT_TAX_ID,
                TAX_RATE: createdRecord.TAX_RATE,
                TAX_AMOUNT: createdRecord.TAX_AMOUNT,
                CUSTOMER_SITE_USE_ID: createdRecord.CUSTOMER_SITE_USE_ID,
                CUSTOMER_RECEIPT_REFERENCE: createdRecord.CUSTOMER_RECEIPT_REFERENCE,
                RECEIPT_METHOD_ID: createdRecord.RECEIPT_METHOD_ID,
                RECEIPT_METHOD_NAME: createdRecord.RECEIPT_METHOD_NAME,
                REFERENCE_TYPE: createdRecord.REFERENCE_TYPE,
                REFERENCE_NUM: createdRecord.REFERENCE_NUM,
                REFERENCE_ID: createdRecord.REFERENCE_ID,
                OVERRIDE_REMIT_ACCOUNT_FLAG: createdRecord.OVERRIDE_REMIT_ACCOUNT_FLAG,
                REMITTENCE_BANK_ACCOUNT_ID: createdRecord.REMITTENCE_BANK_ACCOUNT_ID,
                REMITTENCE_BANK_ACCOUNT_NUM: createdRecord.REMITTENCE_BANK_ACCOUNT_NUM,
                REMITTENCE_BANK_ACCOUNT_NAME: createdRecord.REMITTENCE_BANK_ACCOUNT_NAME,
                DOC_SEQUENCE_VALUE: createdRecord.DOC_SEQUENCE_VALUE,
                MATURITY_DATE: createdRecord.MATURITY_DATE,
                DEPOSIT_DATE: createdRecord.DEPOSIT_DATE,
                USSGL_TRANSACTION_CODE: createdRecord.USSGL_TRANSACTION_CODE,
                ANTICPATED_CLEARING_DATE: createdRecord.ANTICPATED_CLEARING_DATE,
                ATTRIBUTE_CATEGORY: createdRecord.ATTRIBUTE_CATEGORY,
                ATTRIBUTE1: createdRecord.ATTRIBUTE1,
                ATTRIBUTE2: createdRecord.ATTRIBUTE2,
                ATTRIBUTE3: createdRecord.ATTRIBUTE3,
                ATTRIBUTE4: createdRecord.ATTRIBUTE4,
                ATTRIBUTE5: createdRecord.ATTRIBUTE5,
                ATTRIBUTE6: createdRecord.ATTRIBUTE6,
                ATTRIBUTE7: createdRecord.ATTRIBUTE7,
                ATTRIBUTE8: createdRecord.ATTRIBUTE8,
                ATTRIBUTE9: createdRecord.ATTRIBUTE9,
                ATTRIBUTE10: createdRecord.ATTRIBUTE10,
                ATTRIBUTE11: createdRecord.ATTRIBUTE11,
                ATTRIBUTE12: createdRecord.ATTRIBUTE12,
                ATTRIBUTE13: createdRecord.ATTRIBUTE13,
                ATTRIBUTE14: createdRecord.ATTRIBUTE14,
                GLOBAL_ATTRIBUTE1: createdRecord.GLOBAL_ATTRIBUTE1,
                GLOBAL_ATTRIBUTE2: createdRecord.GLOBAL_ATTRIBUTE2,
                GLOBAL_ATTRIBUTE3: createdRecord.GLOBAL_ATTRIBUTE3,
                GLOBAL_ATTRIBUTE4: createdRecord.GLOBAL_ATTRIBUTE4,
                GLOBAL_ATTRIBUTE5: createdRecord.GLOBAL_ATTRIBUTE5,
                GLOBAL_ATTRIBUTE6: createdRecord.GLOBAL_ATTRIBUTE6,
                GLOBAL_ATTRIBUTE7: createdRecord.GLOBAL_ATTRIBUTE7,
                GLOBAL_ATTRIBUTE8: createdRecord.GLOBAL_ATTRIBUTE8,
                GLOBAL_ATTRIBUTE9: createdRecord.GLOBAL_ATTRIBUTE9,
                GLOBAL_ATTRIBUTE10: createdRecord.GLOBAL_ATTRIBUTE10,
                GLOBAL_ATTRIBUTE11: createdRecord.GLOBAL_ATTRIBUTE11,
                GLOBAL_ATTRIBUTE12: createdRecord.GLOBAL_ATTRIBUTE12,
                GLOBAL_ATTRIBUTE13: createdRecord.GLOBAL_ATTRIBUTE13,
                GLOBAL_ATTRIBUTE14: createdRecord.GLOBAL_ATTRIBUTE14,
                GLOBAL_ATTRIBUTE15: createdRecord.GLOBAL_ATTRIBUTE15,
                ISSUER_NAME: createdRecord.ISSUER_NAME,
                ISSUE_DATE: createdRecord.ISSUE_DATE,
                ISSUER_BANK_BRANCH_ID: createdRecord.ISSUER_BANK_BRANCH_ID,
                INSTALLMENT: createdRecord.INSTALLMENT,
                CALLED_FROM: createdRecord.CALLED_FROM,
                CASH_RECEIPT_ID: createdRecord.CASH_RECEIPT_ID,
                COMMENTS: createdRecord.COMMENTS,
                IFACE_MODE: createdRecord.IFACE_MODE,
                GROUP_ID: createdRecord.GROUP_ID,
                REQUEST_ID: createdRecord.REQUEST_ID,
                ORG_NAME: createdRecord.ORG_NAME,
                ORG_ID: createdRecord.ORG_ID,
                SOURCE_HEADER_ID: createdRecord.SOURCE_HEADER_ID,
                SOURCE_LINE_ID: createdRecord.SOURCE_LINE_ID,
                SOURCE_BATCH_ID: createdRecord.SOURCE_BATCH_ID,
                IFACE_STATUS: createdRecord.IFACE_STATUS,
                IFACE_MESSAGE: createdRecord.IFACE_MESSAGE,
                CREATION_DATE: createdRecord.CREATION_DATE,
                CREATED_BY: createdRecord.CREATED_BY,
                LAST_UPDATE_LOGIN: createdRecord.LAST_UPDATE_LOGIN,
                LAST_UPDATE_DATE: createdRecord.LAST_UPDATE_DATE,
                LAST_UPDATED_BY: createdRecord.LAST_UPDATED_BY,
            };

            return response;
        } catch (error) {
            this.logger.error('Error creating AR Receipt:', error);
            throw error;
        }
    }
}
