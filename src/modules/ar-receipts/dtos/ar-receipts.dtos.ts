import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateArReceiptDto {

    @ApiProperty({
        description: 'Source System',
        example: 'DMS',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_SYSTEM?: string;

    @ApiProperty({
        description: 'Receipt Number',
        example: 'JAT/RCP/2024/01/000001',
    })
    @IsString()
    @IsNotEmpty()
    RECEIPT_NUMBER: string;

    @ApiProperty({
        description: 'Receipt Date',
        example: '2023-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    RECEIPT_DATE: string;

    @ApiProperty({
        description: 'GL Date',
        example: '2023-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    GL_DATE: string;

    @ApiProperty({
        description: 'Amount',
        example: 10000000,
    })
    @IsNumber()
    @IsNotEmpty()
    AMOUNT: number;

    @ApiProperty({
        description: 'Factor Discount Amount',
        example: 0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    FACTOR_DISCOUNT_AMOUNT?: number;

    @ApiProperty({
        description: 'Customer ID',
        example: 100,
    })
    @IsNumber()
    @IsNotEmpty()
    CUSTOMER_ID: number;

    @ApiProperty({
        description: 'Customer Name',
        example: 'CUST1',
    })
    @IsString()
    @IsNotEmpty()
    CUSTOMER_NAME: string;

    @ApiProperty({
        description: 'Customer Number',
        example: '4001',
    })
    @IsString()
    @IsNotEmpty()
    CUSTOMER_NUMBER: string;

    @ApiProperty({
        description: 'User Currency Code',
        example: 'IDR',
        required: false,
    })
    @IsString()
    @IsOptional()
    USR_CURRENCY_CODE?: string;

    @ApiProperty({
        description: 'Currency Code',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    CURRENCY_CODE: string;

    @ApiProperty({
        description: 'Customer Bank Account ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    CUSTOMER_BANK_ACCOUNT_ID?: number;

    @ApiProperty({
        description: 'Customer Bank Account Number',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    CUSTOMER_BANK_ACCOUNT_NUM?: string;

    @ApiProperty({
        description: 'Customer Bank Account Name',
        example: 'Bank Account Name',
        required: false,
    })
    @IsString()
    @IsOptional()
    CUSTOMER_BANK_ACCOUNT_NAME?: string;

    @ApiProperty({
        description: 'User Exchange Rate Type',
        example: 'Corporate',
        required: false,
    })
    @IsString()
    @IsOptional()
    USR_EXCHANGE_RATE_TYPE?: string;

    @ApiProperty({
        description: 'Exchange Rate Type',
        example: 'Corporate',
        required: false,
    })
    @IsString()
    @IsOptional()
    EXCHANGE_RATE_TYPE?: string;

    @ApiProperty({
        description: 'Exchange Rate',
        example: 1.0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    EXCHANGE_RATE?: number;

    @ApiProperty({
        description: 'Exchange Date',
        example: '2023-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    EXCHANGE_DATE?: string;

    @ApiProperty({
        description: 'Activity',
        example: 'RECEIPT',
        required: false,
    })
    @IsString()
    @IsOptional()
    ACTIVITY?: string;

    @ApiProperty({
        description: 'Misc Payment Source',
        example: 'CASH',
        required: false,
    })
    @IsString()
    @IsOptional()
    MISC_PAYMENT_SOURCE?: string;

    @ApiProperty({
        description: 'Location',
        example: 'JAKARTA',
        required: false,
    })
    @IsString()
    @IsOptional()
    LOCATION?: string;

    @ApiProperty({
        description: 'Tax Code',
        example: 'VAT',
        required: false,
    })
    @IsString()
    @IsOptional()
    TAX_CODE?: string;

    @ApiProperty({
        description: 'VAT Tax ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    VAT_TAX_ID?: number;

    @ApiProperty({
        description: 'Tax Rate',
        example: 11.0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TAX_RATE?: number;

    @ApiProperty({
        description: 'Tax Amount',
        example: 1100000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TAX_AMOUNT?: number;

    @ApiProperty({
        description: 'Customer Site Use ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    CUSTOMER_SITE_USE_ID?: number;

    @ApiProperty({
        description: 'Customer Receipt Reference',
        example: 'REF001',
        required: false,
    })
    @IsString()
    @IsOptional()
    CUSTOMER_RECEIPT_REFERENCE?: string;

    @ApiProperty({
        description: 'Receipt Method ID',
        example: 1000,
    })
    @IsNumber()
    @IsNotEmpty()
    RECEIPT_METHOD_ID: number;

    @ApiProperty({
        description: 'Receipt Method Name',
        example: 'Kas Kecil JAT_Tunai',
    })
    @IsString()
    @IsNotEmpty()
    RECEIPT_METHOD_NAME: string;

    @ApiProperty({
        description: 'Reference Type',
        example: 'INVOICE',
        required: false,
    })
    @IsString()
    @IsOptional()
    REFERENCE_TYPE?: string;

    @ApiProperty({
        description: 'Reference Number',
        example: 'REF123',
        required: false,
    })
    @IsString()
    @IsOptional()
    REFERENCE_NUM?: string;

    @ApiProperty({
        description: 'Reference ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    REFERENCE_ID?: number;

    @ApiProperty({
        description: 'Override Remit Account Flag',
        example: 'N',
        required: false,
    })
    @IsString()
    @IsOptional()
    OVERRIDE_REMIT_ACCOUNT_FLAG?: string;

    @ApiProperty({
        description: 'Remittance Bank Account ID',
        example: 12001,
    })
    @IsNumber()
    @IsNotEmpty()
    REMITTENCE_BANK_ACCOUNT_ID: number;

    @ApiProperty({
        description: 'Remittance Bank Account Number',
        example: 'JAT-111101002',
    })
    @IsString()
    @IsNotEmpty()
    REMITTENCE_BANK_ACCOUNT_NUM: string;

    @ApiProperty({
        description: 'Remittance Bank Account Name',
        example: 'Kas Kecil JAT',
    })
    @IsString()
    @IsNotEmpty()
    REMITTENCE_BANK_ACCOUNT_NAME: string;

    @ApiProperty({
        description: 'Document Sequence Value',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    DOC_SEQUENCE_VALUE?: number;

    @ApiProperty({
        description: 'Maturity Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    MATURITY_DATE: string;

    @ApiProperty({
        description: 'Deposit Date',
        example: '2023-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    DEPOSIT_DATE?: string;

    @ApiProperty({
        description: 'USSGL Transaction Code',
        example: 'USSGL001',
        required: false,
    })
    @IsString()
    @IsOptional()
    USSGL_TRANSACTION_CODE?: string;

    @ApiProperty({
        description: 'Anticipated Clearing Date',
        example: '2023-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    ANTICPATED_CLEARING_DATE?: string;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE_CATEGORY: string;

    @ApiProperty({
        description: 'Attribute 1',
        example: 'Value 1',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE1?: string;

    @ApiProperty({
        description: 'Attribute 2',
        example: 'Value 2',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE2?: string;

    @ApiProperty({
        description: 'Attribute 3',
        example: 'Value 3',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE3?: string;

    @ApiProperty({
        description: 'Attribute 4',
        example: 'Value 4',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE4?: string;

    @ApiProperty({
        description: 'Attribute 5',
        example: 'Value 5',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE5?: string;

    @ApiProperty({
        description: 'Attribute 6',
        example: 'Value 6',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE6?: string;

    @ApiProperty({
        description: 'Attribute 7',
        example: 'Value 7',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE7?: string;

    @ApiProperty({
        description: 'Attribute 8',
        example: 'Value 8',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE8?: string;

    @ApiProperty({
        description: 'Attribute 9',
        example: 'Value 9',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE9?: string;

    @ApiProperty({
        description: 'Attribute 10',
        example: 'BCA',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE10: string;

    @ApiProperty({
        description: 'Attribute 11',
        example: 'JAT/CP/2024/01/000001',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE11: string;

    @ApiProperty({
        description: 'Attribute 12',
        example: 'JAT/SO/2024/01/000001',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE12: string;

    @ApiProperty({
        description: 'Attribute 13',
        example: 'JAT/CP/2024/01/000001',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE13: string;

    @ApiProperty({
        description: 'Attribute 14',
        example: 'JAT/RCP/2024/01/000001',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE14: string;

    @ApiProperty({
        description: 'Attribute 15',
        example: 'Value 15',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE15?: string;

    @ApiProperty({
        description: 'Global Attribute 1',
        example: 'Global Value 1',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE1?: string;

    @ApiProperty({
        description: 'Global Attribute 2',
        example: 'Global Value 2',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE2?: string;

    @ApiProperty({
        description: 'Global Attribute 3',
        example: 'Global Value 3',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE3?: string;

    @ApiProperty({
        description: 'Global Attribute 4',
        example: 'Global Value 4',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE4?: string;

    @ApiProperty({
        description: 'Global Attribute 5',
        example: 'Global Value 5',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE5?: string;

    @ApiProperty({
        description: 'Global Attribute 6',
        example: 'Global Value 6',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE6?: string;

    @ApiProperty({
        description: 'Global Attribute 7',
        example: 'Global Value 7',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE7?: string;

    @ApiProperty({
        description: 'Global Attribute 8',
        example: 'Global Value 8',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE8?: string;

    @ApiProperty({
        description: 'Global Attribute 9',
        example: 'Global Value 9',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE9?: string;

    @ApiProperty({
        description: 'Global Attribute 10',
        example: 'Global Value 10',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE10?: string;

    @ApiProperty({
        description: 'Global Attribute 11',
        example: 'Global Value 11',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE11?: string;

    @ApiProperty({
        description: 'Global Attribute 12',
        example: 'Global Value 12',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE12?: string;

    @ApiProperty({
        description: 'Global Attribute 13',
        example: 'Global Value 13',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Global Attribute 14',
        example: 'Global Value 14',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Global Attribute 15',
        example: 'Global Value 15',
        required: false,
    })
    @IsString()
    @IsOptional()
    GLOBAL_ATTRIBUTE15?: string;

    @ApiProperty({
        description: 'Issuer Name',
        example: 'Bank Name',
        required: false,
    })
    @IsString()
    @IsOptional()
    ISSUER_NAME?: string;

    @ApiProperty({
        description: 'Issue Date',
        example: '2023-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    ISSUE_DATE?: string;

    @ApiProperty({
        description: 'Issuer Bank Branch ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    ISSUER_BANK_BRANCH_ID?: number;

    @ApiProperty({
        description: 'Installment',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    INSTALLMENT?: number;

    @ApiProperty({
        description: 'Called From',
        example: 'API',
        required: false,
    })
    @IsString()
    @IsOptional()
    CALLED_FROM?: string;

    @ApiProperty({
        description: 'Cash Receipt ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    CASH_RECEIPT_ID?: number;

    @ApiProperty({
        description: 'Comments',
        example: 'Sample receipt comment',
        required: false,
    })
    @IsString()
    @IsOptional()
    COMMENTS?: string;

    @ApiProperty({
        description: 'Interface Mode',
        example: 'CASH',
    })
    @IsString()
    @IsNotEmpty()
    IFACE_MODE: string;

    @ApiProperty({
        description: 'Group ID',
        example: 'GROUP001',
        required: false,
    })
    @IsString()
    @IsOptional()
    GROUP_ID?: string;

    @ApiProperty({
        description: 'Request ID',
        example: 98765,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    REQUEST_ID?: number;

    @ApiProperty({
        description: 'Organization Name',
        example: 'JAT_OU',
    })
    @IsString()
    @IsNotEmpty()
    ORG_NAME: string;

    @ApiProperty({
        description: 'Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;



    @ApiProperty({
        description: 'Source Header ID',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_HEADER_ID: string;

    @ApiProperty({
        description: 'Source Line ID',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_LINE_ID: string;

    @ApiProperty({
        description: 'Source Batch ID',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_BATCH_ID: string;

    @ApiProperty({
        description: 'Interface Status',
        example: 'READY',
    })
    @IsString()
    @IsNotEmpty()
    IFACE_STATUS: string;

    @ApiProperty({
        description: 'Interface Message',
        example: 'Success',
        required: false,
    })
    @IsString()
    @IsOptional()
    IFACE_MESSAGE?: string;

    @ApiProperty({
        description: 'Last Update Login',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    LAST_UPDATE_LOGIN?: number;

    @ApiProperty({
        description: 'Creation Date',
        example: '2023-11-27',
    })
    @IsDateString()
    @IsNotEmpty()
    CREATION_DATE: string;

    @ApiProperty({
        description: 'Created By',
        example: 1234,
    })
    @IsNumber()
    @IsNotEmpty()
    CREATED_BY: number;

    @ApiProperty({
        description: 'Last Update Date',
        example: '2023-11-27',
    })
    @IsDateString()
    @IsNotEmpty()
    LAST_UPDATE_DATE: string;

    @ApiProperty({
        description: 'Last Updated By',
        example: 1234,
    })
    @IsNumber()
    @IsNotEmpty()
    LAST_UPDATED_BY: number;
}

export class ArReceiptResponseDto {
    @ApiProperty({
        description: 'Interface ID (autogenerated)',
        example: 12345,
    })
    IFACE_ID: number;

    @ApiProperty({
        description: 'Source System',
        example: 'DMS',
    })
    SOURCE_SYSTEM: string;

    @ApiProperty({
        description: 'Receipt Number',
        example: 'JAT/RCP/2024/01/000001',
    })
    RECEIPT_NUMBER: string;

    @ApiProperty({
        description: 'Receipt Date',
        example: '2023-01-01T00:00:00.000Z',
    })
    RECEIPT_DATE: Date;

    @ApiProperty({
        description: 'GL Date',
        example: '2023-01-01T00:00:00.000Z',
    })
    GL_DATE: Date;

    @ApiProperty({
        description: 'Amount',
        example: 10000000,
    })
    AMOUNT: number;

    @ApiProperty({
        description: 'Factor Discount Amount',
        example: 0,
    })
    FACTOR_DISCOUNT_AMOUNT: number;

    @ApiProperty({
        description: 'Customer ID',
        example: 100,
    })
    CUSTOMER_ID: number;

    @ApiProperty({
        description: 'Customer Name',
        example: 'CUST1',
    })
    CUSTOMER_NAME: string;

    @ApiProperty({
        description: 'Customer Number',
        example: '4001',
    })
    CUSTOMER_NUMBER: string;

    @ApiProperty({
        description: 'User Currency Code',
        example: 'IDR',
    })
    USR_CURRENCY_CODE: string;

    @ApiProperty({
        description: 'Currency Code',
        example: 'IDR',
    })
    CURRENCY_CODE: string;

    @ApiProperty({
        description: 'Customer Bank Account ID',
        example: 12345,
    })
    CUSTOMER_BANK_ACCOUNT_ID: number;

    @ApiProperty({
        description: 'Customer Bank Account Number',
        example: '1234567890',
    })
    CUSTOMER_BANK_ACCOUNT_NUM: string;

    @ApiProperty({
        description: 'Customer Bank Account Name',
        example: 'Bank Account Name',
    })
    CUSTOMER_BANK_ACCOUNT_NAME: string;

    @ApiProperty({
        description: 'User Exchange Rate Type',
        example: 'Corporate',
    })
    USR_EXCHANGE_RATE_TYPE: string;

    @ApiProperty({
        description: 'Exchange Rate Type',
        example: 'Corporate',
    })
    EXCHANGE_RATE_TYPE: string;

    @ApiProperty({
        description: 'Exchange Rate',
        example: 1.0,
    })
    EXCHANGE_RATE: number;

    @ApiProperty({
        description: 'Exchange Date',
        example: '2023-01-01T00:00:00.000Z',
    })
    EXCHANGE_DATE: Date;

    @ApiProperty({
        description: 'Activity',
        example: 'RECEIPT',
    })
    ACTIVITY: string;

    @ApiProperty({
        description: 'Misc Payment Source',
        example: 'CASH',
    })
    MISC_PAYMENT_SOURCE: string;

    @ApiProperty({
        description: 'Location',
        example: 'JAKARTA',
    })
    LOCATION: string;

    @ApiProperty({
        description: 'Tax Code',
        example: 'VAT',
    })
    TAX_CODE: string;

    @ApiProperty({
        description: 'VAT Tax ID',
        example: 12345,
    })
    VAT_TAX_ID: number;

    @ApiProperty({
        description: 'Tax Rate',
        example: 11.0,
    })
    TAX_RATE: number;

    @ApiProperty({
        description: 'Tax Amount',
        example: 1100000,
    })
    TAX_AMOUNT: number;

    @ApiProperty({
        description: 'Customer Site Use ID',
        example: 12345,
    })
    CUSTOMER_SITE_USE_ID: number;

    @ApiProperty({
        description: 'Customer Receipt Reference',
        example: 'REF001',
    })
    CUSTOMER_RECEIPT_REFERENCE: string;

    @ApiProperty({
        description: 'Receipt Method ID',
        example: 1000,
    })
    RECEIPT_METHOD_ID: number;

    @ApiProperty({
        description: 'Receipt Method Name',
        example: 'Kas Kecil JAT_Tunai',
    })
    RECEIPT_METHOD_NAME: string;

    @ApiProperty({
        description: 'Reference Type',
        example: 'INVOICE',
    })
    REFERENCE_TYPE: string;

    @ApiProperty({
        description: 'Reference Number',
        example: 'REF123',
    })
    REFERENCE_NUM: string;

    @ApiProperty({
        description: 'Reference ID',
        example: 12345,
    })
    REFERENCE_ID: number;

    @ApiProperty({
        description: 'Override Remit Account Flag',
        example: 'N',
    })
    OVERRIDE_REMIT_ACCOUNT_FLAG: string;

    @ApiProperty({
        description: 'Remittance Bank Account ID',
        example: 12001,
    })
    REMITTENCE_BANK_ACCOUNT_ID: number;

    @ApiProperty({
        description: 'Remittance Bank Account Number',
        example: 'JAT-111101002',
    })
    REMITTENCE_BANK_ACCOUNT_NUM: string;

    @ApiProperty({
        description: 'Remittance Bank Account Name',
        example: 'Kas Kecil JAT',
    })
    REMITTENCE_BANK_ACCOUNT_NAME: string;

    @ApiProperty({
        description: 'Document Sequence Value',
        example: 12345,
    })
    DOC_SEQUENCE_VALUE: number;

    @ApiProperty({
        description: 'Maturity Date',
        example: '2024-01-01T00:00:00.000Z',
    })
    MATURITY_DATE: Date;

    @ApiProperty({
        description: 'Deposit Date',
        example: '2023-01-01T00:00:00.000Z',
    })
    DEPOSIT_DATE: Date;

    @ApiProperty({
        description: 'USSGL Transaction Code',
        example: 'USSGL001',
    })
    USSGL_TRANSACTION_CODE: string;

    @ApiProperty({
        description: 'Anticipated Clearing Date',
        example: '2023-01-01T00:00:00.000Z',
    })
    ANTICPATED_CLEARING_DATE: Date;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'NNA FPPR',
    })
    ATTRIBUTE_CATEGORY: string;

    @ApiProperty({
        description: 'Attribute 1',
        example: 'Value 1',
    })
    ATTRIBUTE1: string;

    @ApiProperty({
        description: 'Attribute 2',
        example: 'Value 2',
    })
    ATTRIBUTE2: string;

    @ApiProperty({
        description: 'Attribute 3',
        example: 'Value 3',
    })
    ATTRIBUTE3: string;

    @ApiProperty({
        description: 'Attribute 4',
        example: 'Value 4',
    })
    ATTRIBUTE4: string;

    @ApiProperty({
        description: 'Attribute 5',
        example: 'Value 5',
    })
    ATTRIBUTE5: string;

    @ApiProperty({
        description: 'Attribute 6',
        example: 'Value 6',
    })
    ATTRIBUTE6: string;

    @ApiProperty({
        description: 'Attribute 7',
        example: 'Value 7',
    })
    ATTRIBUTE7: string;

    @ApiProperty({
        description: 'Attribute 8',
        example: 'Value 8',
    })
    ATTRIBUTE8: string;

    @ApiProperty({
        description: 'Attribute 9',
        example: 'Value 9',
    })
    ATTRIBUTE9: string;

    @ApiProperty({
        description: 'Attribute 10',
        example: 'BCA',
    })
    ATTRIBUTE10: string;

    @ApiProperty({
        description: 'Attribute 11',
        example: 'JAT/CP/2024/01/000001',
    })
    ATTRIBUTE11: string;

    @ApiProperty({
        description: 'Attribute 12',
        example: 'JAT/SO/2024/01/000001',
    })
    ATTRIBUTE12: string;

    @ApiProperty({
        description: 'Attribute 13',
        example: 'JAT/CP/2024/01/000001',
    })
    ATTRIBUTE13: string;

    @ApiProperty({
        description: 'Attribute 14',
        example: 'JAT/RCP/2024/01/000001',
    })
    ATTRIBUTE14: string;

    @ApiProperty({
        description: 'Global Attribute 1',
        example: 'Global Value 1',
    })
    GLOBAL_ATTRIBUTE1: string;

    @ApiProperty({
        description: 'Global Attribute 2',
        example: 'Global Value 2',
    })
    GLOBAL_ATTRIBUTE2: string;

    @ApiProperty({
        description: 'Global Attribute 3',
        example: 'Global Value 3',
    })
    GLOBAL_ATTRIBUTE3: string;

    @ApiProperty({
        description: 'Global Attribute 4',
        example: 'Global Value 4',
    })
    GLOBAL_ATTRIBUTE4: string;

    @ApiProperty({
        description: 'Global Attribute 5',
        example: 'Global Value 5',
    })
    GLOBAL_ATTRIBUTE5: string;

    @ApiProperty({
        description: 'Global Attribute 6',
        example: 'Global Value 6',
    })
    GLOBAL_ATTRIBUTE6: string;

    @ApiProperty({
        description: 'Global Attribute 7',
        example: 'Global Value 7',
    })
    GLOBAL_ATTRIBUTE7: string;

    @ApiProperty({
        description: 'Global Attribute 8',
        example: 'Global Value 8',
    })
    GLOBAL_ATTRIBUTE8: string;

    @ApiProperty({
        description: 'Global Attribute 9',
        example: 'Global Value 9',
    })
    GLOBAL_ATTRIBUTE9: string;

    @ApiProperty({
        description: 'Global Attribute 10',
        example: 'Global Value 10',
    })
    GLOBAL_ATTRIBUTE10: string;

    @ApiProperty({
        description: 'Global Attribute 11',
        example: 'Global Value 11',
    })
    GLOBAL_ATTRIBUTE11: string;

    @ApiProperty({
        description: 'Global Attribute 12',
        example: 'Global Value 12',
    })
    GLOBAL_ATTRIBUTE12: string;

    @ApiProperty({
        description: 'Global Attribute 13',
        example: 'Global Value 13',
    })
    GLOBAL_ATTRIBUTE13: string;

    @ApiProperty({
        description: 'Global Attribute 14',
        example: 'Global Value 14',
    })
    GLOBAL_ATTRIBUTE14: string;

    @ApiProperty({
        description: 'Global Attribute 15',
        example: 'Global Value 15',
    })
    GLOBAL_ATTRIBUTE15: string;

    @ApiProperty({
        description: 'Issuer Name',
        example: 'Bank Name',
    })
    ISSUER_NAME: string;

    @ApiProperty({
        description: 'Issue Date',
        example: '2023-01-01T00:00:00.000Z',
    })
    ISSUE_DATE: Date;

    @ApiProperty({
        description: 'Issuer Bank Branch ID',
        example: 12345,
    })
    ISSUER_BANK_BRANCH_ID: number;

    @ApiProperty({
        description: 'Installment',
        example: 1,
    })
    INSTALLMENT: number;

    @ApiProperty({
        description: 'Called From',
        example: 'API',
    })
    CALLED_FROM: string;

    @ApiProperty({
        description: 'Cash Receipt ID',
        example: 12345,
    })
    CASH_RECEIPT_ID: number;

    @ApiProperty({
        description: 'Comments',
        example: 'Sample receipt comment',
    })
    COMMENTS: string;

    @ApiProperty({
        description: 'Interface Mode',
        example: 'CASH',
    })
    IFACE_MODE: string;

    @ApiProperty({
        description: 'Group ID',
        example: 'GROUP001',
    })
    GROUP_ID: string;

    @ApiProperty({
        description: 'Request ID',
        example: 98765,
    })
    REQUEST_ID: number;

    @ApiProperty({
        description: 'Organization Name',
        example: 'JAT_OU',
    })
    ORG_NAME: string;

    @ApiProperty({
        description: 'Organization ID',
        example: 125,
    })
    ORG_ID: number;



    @ApiProperty({
        description: 'Source Header ID',
        example: '1234567890',
    })
    SOURCE_HEADER_ID: string;

    @ApiProperty({
        description: 'Source Line ID',
        example: '1234567890',
    })
    SOURCE_LINE_ID: string;

    @ApiProperty({
        description: 'Source Batch ID',
        example: '1234567890',
    })
    SOURCE_BATCH_ID: string;

    @ApiProperty({
        description: 'Interface Status',
        example: 'READY',
    })
    IFACE_STATUS: string;

    @ApiProperty({
        description: 'Interface Message',
        example: 'Success',
    })
    IFACE_MESSAGE: string;

    @ApiProperty({
        description: 'Creation Date',
        example: '2023-11-27T00:00:00.000Z',
    })
    CREATION_DATE: Date;

    @ApiProperty({
        description: 'Created By',
        example: 1234,
    })
    CREATED_BY: number;

    @ApiProperty({
        description: 'Last Update Login',
        example: 12345,
    })
    LAST_UPDATE_LOGIN: number;

    @ApiProperty({
        description: 'Last Update Date',
        example: '2023-11-27T00:00:00.000Z',
    })
    LAST_UPDATE_DATE: Date;

    @ApiProperty({
        description: 'Last Updated By',
        example: 1234,
    })
    LAST_UPDATED_BY: number;
}
