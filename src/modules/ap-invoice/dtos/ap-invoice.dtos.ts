import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateApInvoiceHeaderDto {
    @ApiProperty({
        description: 'Invoice Type Lookup Code',
        example: 'STANDARD',
    })
    @IsString()
    @IsNotEmpty()
    INVOICE_TYPE_LOOKUP_CODE: string;

    @ApiProperty({
        description: 'Invoice Date',
        example: '2023-10-31',
    })
    @IsDateString()
    @IsNotEmpty()
    INVOICE_DATE: string;

    @ApiProperty({
        description: 'Vendor ID',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    VENDOR_ID: number;

    @ApiProperty({
        description: 'Vendor Number',
        example: '2',
    })
    @IsString()
    @IsNotEmpty()
    VENDOR_NUM: string;

    @ApiProperty({
        description: 'Invoice Amount',
        example: 50000,
    })
    @IsNumber()
    @IsNotEmpty()
    INVOICE_AMOUNT: number;

    @ApiProperty({
        description: 'Invoice Number',
        example: '11121',
    })
    @IsString()
    @IsNotEmpty()
    INVOICE_NUM: string;

    @ApiProperty({
        description: 'Vendor Name',
        example: 'INDOFOOD SUKSES MAKMUR, PT',
    })
    @IsString()
    @IsNotEmpty()
    VENDOR_NAME: string;

    @ApiProperty({
        description: 'Vendor Site ID',
        example: 3,
    })
    @IsNumber()
    @IsNotEmpty()
    VENDOR_SITE_ID: number;

    @ApiProperty({
        description: 'Vendor Site Code',
        example: 'Jakarta',
    })
    @IsString()
    @IsNotEmpty()
    VENDOR_SITE_CODE: string;

    @ApiProperty({
        description: 'Invoice Currency Code',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    INVOICE_CURRENCY_CODE: string;

    @ApiProperty({
        description: 'Terms ID',
        example: 10005,
    })
    @IsNumber()
    @IsNotEmpty()
    TERMS_ID: number;

    @ApiProperty({
        description: 'Terms Name',
        example: 'Immediate',
    })
    @IsString()
    @IsNotEmpty()
    TERMS_NAME: string;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE_CATEGORY: string;

    @ApiProperty({
        description: 'Attribute 13 - Call Plan Number',
        example: 'JAT/CP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14 - Expense Number',
        example: 'JAT/EXP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Source',
        example: 'DMS',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE: string;

    @ApiProperty({
        description: 'Invoice Received Date',
        example: '2023-11-13',
    })
    @IsDateString()
    @IsNotEmpty()
    INVOICE_RECEIVED_DATE: string;

    @ApiProperty({
        description: 'GL Date',
        example: '2023-11-13',
    })
    @IsDateString()
    @IsNotEmpty()
    GL_DATE: string;

    @ApiProperty({
        description: 'Payment Method Code',
        example: 'Tunai',
    })
    @IsString()
    @IsNotEmpty()
    PAYMENT_METHOD_CODE: string;

    @ApiProperty({
        description: 'Organization Name',
        example: 'HOQ',
    })
    @IsString()
    @IsNotEmpty()
    ORG_NAME: string;

    @ApiProperty({
        description: 'Organization ID',
        example: 82,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;

    @ApiProperty({
        description: 'Source System',
        example: 'DMS',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_SYSTEM: string;

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
}

export class ApInvoiceHeaderResponseDto {
    @ApiProperty({
        description: 'Header Interface ID',
        example: 1001,
    })
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Invoice Type Lookup Code',
        example: 'STANDARD',
    })
    INVOICE_TYPE_LOOKUP_CODE: string;

    @ApiProperty({
        description: 'Invoice Date',
        example: '2023-10-31T00:00:00.000Z',
    })
    INVOICE_DATE: string;

    @ApiProperty({
        description: 'Vendor ID',
        example: 2,
    })
    VENDOR_ID: number;

    @ApiProperty({
        description: 'Vendor Number',
        example: '2',
    })
    VENDOR_NUM: string;

    @ApiProperty({
        description: 'Invoice Amount',
        example: 50000,
    })
    INVOICE_AMOUNT: number;

    @ApiProperty({
        description: 'Invoice Number',
        example: '11121',
    })
    INVOICE_NUM: string;

    @ApiProperty({
        description: 'Vendor Name',
        example: 'INDOFOOD SUKSES MAKMUR, PT',
    })
    VENDOR_NAME: string;

    @ApiProperty({
        description: 'Vendor Site ID',
        example: 3,
    })
    VENDOR_SITE_ID: number;

    @ApiProperty({
        description: 'Vendor Site Code',
        example: 'Jakarta',
    })
    VENDOR_SITE_CODE: string;

    @ApiProperty({
        description: 'Invoice Currency Code',
        example: 'IDR',
    })
    INVOICE_CURRENCY_CODE: string;

    @ApiProperty({
        description: 'Terms ID',
        example: 10005,
    })
    TERMS_ID: number;

    @ApiProperty({
        description: 'Terms Name',
        example: 'Immediate',
    })
    TERMS_NAME: string;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'NNA FPPR',
    })
    ATTRIBUTE_CATEGORY: string;

    @ApiProperty({
        description: 'Attribute 13',
        example: 'JAT/CP/2024/01/000001',
    })
    ATTRIBUTE13: string;

    @ApiProperty({
        description: 'Attribute 14',
        example: 'JAT/EXP/2024/01/000001',
    })
    ATTRIBUTE14: string;

    @ApiProperty({
        description: 'Source',
        example: 'DMS',
    })
    SOURCE: string;

    @ApiProperty({
        description: 'Invoice Received Date',
        example: '2023-11-13T00:00:00.000Z',
    })
    INVOICE_RECEIVED_DATE: string;

    @ApiProperty({
        description: 'GL Date',
        example: '2023-11-13T00:00:00.000Z',
    })
    GL_DATE: string;

    @ApiProperty({
        description: 'Payment Method Code',
        example: 'Tunai',
    })
    PAYMENT_METHOD_CODE: string;

    @ApiProperty({
        description: 'Organization Name',
        example: 'HOQ',
    })
    ORG_NAME: string;

    @ApiProperty({
        description: 'Organization ID',
        example: 82,
    })
    ORG_ID: number;

    @ApiProperty({
        description: 'Source System',
        example: 'DMS',
    })
    SOURCE_SYSTEM: string;

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
        description: 'Creation Date',
        example: '2023-11-27T00:00:00.000Z',
    })
    CREATION_DATE: string;

    @ApiProperty({
        description: 'Created By',
        example: 1234,
    })
    CREATED_BY: number;

    @ApiProperty({
        description: 'Last Update Date',
        example: '2023-11-27T00:00:00.000Z',
    })
    LAST_UPDATE_DATE: string;

    @ApiProperty({
        description: 'Last Updated By',
        example: 1234,
    })
    LAST_UPDATED_BY: number;
}

export class CreateApInvoiceLineDto {
    @ApiProperty({
        description: 'Header Interface ID',
        example: 12345,
    })
    @IsNumber()
    @IsNotEmpty()
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Distribution Code Concatenated',
        example: 'NNA.1B03.00000000.021220.000000.610310003.000.000.000.000',
    })
    @IsString()
    @IsNotEmpty()
    DIST_CODE_CONCATENATED: string;

    @ApiProperty({
        description: 'Distribution Code Combination ID',
        example: 58832,
    })
    @IsNumber()
    @IsNotEmpty()
    DIST_CODE_COMBINATION_ID: number;

    @ApiProperty({
        description: 'Organization Name',
        example: 'HOQ',
    })
    @IsString()
    @IsNotEmpty()
    ORG_NAME: string;

    @ApiProperty({
        description: 'Organization ID',
        example: 82,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;

    @ApiProperty({
        description: 'Source System',
        example: 'OUTSYSTEM',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_SYSTEM: string;

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
        description: 'Line Number',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Line Type Lookup Code',
        example: 'ITEM',
    })
    @IsString()
    @IsNotEmpty()
    LINE_TYPE_LOOKUP_CODE: string;

    @ApiProperty({
        description: 'Amount',
        example: 50000,
    })
    @IsNumber()
    @IsNotEmpty()
    AMOUNT: number;

    @ApiProperty({
        description: 'Accounting Date',
        example: '2023-10-31',
    })
    @IsDateString()
    @IsNotEmpty()
    ACCOUNTING_DATE: string;

    @ApiProperty({
        description: 'Tax Code',
        example: 'NNA_PPN',
    })
    @IsString()
    @IsNotEmpty()
    TAX_CODE: string;

    @ApiProperty({
        description: 'Description',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    DESCRIPTION?: string;
}

export class ApInvoiceLineResponseDto {
    @ApiProperty({
        description: 'Header Interface ID',
        example: 12345,
    })
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Distribution Code Concatenated',
        example: 'NNA.1B03.00000000.021220.000000.610310003.000.000.000.000',
    })
    DIST_CODE_CONCATENATED: string;

    @ApiProperty({
        description: 'Distribution Code Combination ID',
        example: 58832,
    })
    DIST_CODE_COMBINATION_ID: number;

    @ApiProperty({
        description: 'Organization Name',
        example: 'HOQ',
    })
    ORG_NAME: string;

    @ApiProperty({
        description: 'Organization ID',
        example: 82,
    })
    ORG_ID: number;

    @ApiProperty({
        description: 'Source System',
        example: 'OUTSYSTEM',
    })
    SOURCE_SYSTEM: string;

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
        description: 'Creation Date',
        example: '2023-11-27T00:00:00.000Z',
    })
    CREATION_DATE: string;

    @ApiProperty({
        description: 'Created By',
        example: 1234,
    })
    CREATED_BY: number;

    @ApiProperty({
        description: 'Last Update Date',
        example: '2023-11-27T00:00:00.000Z',
    })
    LAST_UPDATE_DATE: string;

    @ApiProperty({
        description: 'Last Updated By',
        example: 1234,
    })
    LAST_UPDATED_BY: number;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Line Type Lookup Code',
        example: 'ITEM',
    })
    LINE_TYPE_LOOKUP_CODE: string;

    @ApiProperty({
        description: 'Amount',
        example: 50000,
    })
    AMOUNT: number;

    @ApiProperty({
        description: 'Accounting Date',
        example: '2023-10-31T00:00:00.000Z',
    })
    ACCOUNTING_DATE: string;

    @ApiProperty({
        description: 'Tax Code',
        example: 'NNA_PPN',
    })
    TAX_CODE: string;

    @ApiProperty({
        description: 'Description',
        example: '',
    })
    DESCRIPTION: string;

    @ApiProperty({
        description: 'Interface Status',
        example: 'READY',
    })
    IFACE_STATUS: string;

    @ApiProperty({
        description: 'Interface Message',
        example: '',
    })
    IFACE_MESSAGE: string;
}

export class CreateApInvoiceLineItemDto {
    @ApiProperty({
        description: 'Distribution Code Concatenated',
        example: 'NNA.1B03.00000000.021220.000000.610310003.000.000.000.000',
    })
    @IsString()
    @IsNotEmpty()
    DIST_CODE_CONCATENATED: string;

    @ApiProperty({
        description: 'Distribution Code Combination ID',
        example: 58832,
    })
    @IsNumber()
    @IsNotEmpty()
    DIST_CODE_COMBINATION_ID: number;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Line Type Lookup Code',
        example: 'ITEM',
    })
    @IsString()
    @IsNotEmpty()
    LINE_TYPE_LOOKUP_CODE: string;

    @ApiProperty({
        description: 'Amount',
        example: 50000,
    })
    @IsNumber()
    @IsNotEmpty()
    AMOUNT: number;

    @ApiProperty({
        description: 'Accounting Date',
        example: '2023-10-31',
    })
    @IsDateString()
    @IsNotEmpty()
    ACCOUNTING_DATE: string;

    @ApiProperty({
        description: 'Tax Code',
        example: 'NNA_PPN',
    })
    @IsString()
    @IsNotEmpty()
    TAX_CODE: string;

    @ApiProperty({
        description: 'Description',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    DESCRIPTION?: string;
}

export class CreateApInvoiceWithLinesDto {
    @ApiProperty({
        description: 'Invoice Type Lookup Code',
        example: 'STANDARD',
    })
    @IsString()
    @IsNotEmpty()
    INVOICE_TYPE_LOOKUP_CODE: string;

    @ApiProperty({
        description: 'Invoice Date',
        example: '2023-10-31',
    })
    @IsDateString()
    @IsNotEmpty()
    INVOICE_DATE: string;

    @ApiProperty({
        description: 'Vendor ID',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    VENDOR_ID: number;

    @ApiProperty({
        description: 'Vendor Number',
        example: '2',
    })
    @IsString()
    @IsNotEmpty()
    VENDOR_NUM: string;

    @ApiProperty({
        description: 'Invoice Amount',
        example: 50000,
    })
    @IsNumber()
    @IsNotEmpty()
    INVOICE_AMOUNT: number;

    @ApiProperty({
        description: 'Invoice Number',
        example: '11121',
    })
    @IsString()
    @IsNotEmpty()
    INVOICE_NUM: string;

    @ApiProperty({
        description: 'Vendor Name',
        example: 'INDOFOOD SUKSES MAKMUR, PT',
    })
    @IsString()
    @IsNotEmpty()
    VENDOR_NAME: string;

    @ApiProperty({
        description: 'Vendor Site ID',
        example: 3,
    })
    @IsNumber()
    @IsNotEmpty()
    VENDOR_SITE_ID: number;

    @ApiProperty({
        description: 'Vendor Site Code',
        example: 'Jakarta',
    })
    @IsString()
    @IsNotEmpty()
    VENDOR_SITE_CODE: string;

    @ApiProperty({
        description: 'Invoice Currency Code',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    INVOICE_CURRENCY_CODE: string;

    @ApiProperty({
        description: 'Terms ID',
        example: 10005,
    })
    @IsNumber()
    @IsNotEmpty()
    TERMS_ID: number;

    @ApiProperty({
        description: 'Terms Name',
        example: 'Immediate',
    })
    @IsString()
    @IsNotEmpty()
    TERMS_NAME: string;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE_CATEGORY: string;

    @ApiProperty({
        description: 'Attribute 13 - Call Plan Number',
        example: 'JAT/CP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14 - Expense Number',
        example: 'JAT/EXP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Source',
        example: 'DMS',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE: string;

    @ApiProperty({
        description: 'Invoice Received Date',
        example: '2023-11-13',
    })
    @IsDateString()
    @IsNotEmpty()
    INVOICE_RECEIVED_DATE: string;

    @ApiProperty({
        description: 'GL Date',
        example: '2023-11-13',
    })
    @IsDateString()
    @IsNotEmpty()
    GL_DATE: string;

    @ApiProperty({
        description: 'Payment Method Code',
        example: 'Tunai',
    })
    @IsString()
    @IsNotEmpty()
    PAYMENT_METHOD_CODE: string;

    @ApiProperty({
        description: 'Organization Name',
        example: 'HOQ',
    })
    @IsString()
    @IsNotEmpty()
    ORG_NAME: string;

    @ApiProperty({
        description: 'Organization ID',
        example: 82,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;

    @ApiProperty({
        description: 'Source System',
        example: 'DMS',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_SYSTEM: string;

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
        description: 'Invoice Lines',
        type: [CreateApInvoiceLineItemDto],
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateApInvoiceLineItemDto)
    lines: CreateApInvoiceLineItemDto[];
}

export class ApInvoiceWithLinesResponseDto {
    @ApiProperty({
        description: 'AP Invoice Header',
        type: ApInvoiceHeaderResponseDto,
    })
    header: ApInvoiceHeaderResponseDto;

    @ApiProperty({
        description: 'AP Invoice Lines',
        type: [ApInvoiceLineResponseDto],
    })
    lines: ApInvoiceLineResponseDto[];
}
