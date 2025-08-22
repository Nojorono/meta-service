import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateSalesOrderHeaderDto {
    @ApiProperty({
        description: 'Attribute 13 - Call Plan Number',
        example: 'JAT/CP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14 - Sales Order Number',
        example: 'JAT/SO/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    @IsString()
    @IsNotEmpty()
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Context',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    CONTEXT: string;

    @ApiProperty({
        description: 'Invoice To Organization ID',
        example: 29048,
    })
    @IsNumber()
    @IsNotEmpty()
    INVOICE_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Order Category Code',
        example: 'ORDER',
    })
    @IsString()
    @IsNotEmpty()
    ORDER_CATEGORY_CODE: string;

    @ApiProperty({
        description: 'Ordered Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    ORDERED_DATE: string;

    @ApiProperty({
        description: 'Order Type ID',
        example: 1062,
    })
    @IsNumber()
    @IsNotEmpty()
    ORDER_TYPE_ID: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;

    @ApiProperty({
        description: 'Payment Term ID',
        example: 1004,
    })
    @IsNumber()
    @IsNotEmpty()
    PAYMENT_TERM_ID: number;

    @ApiProperty({
        description: 'Price List ID',
        example: 14025,
    })
    @IsNumber()
    @IsNotEmpty()
    PRICE_LIST_ID: number;

    @ApiProperty({
        description: 'Pricing Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    PRICING_DATE: string;

    @ApiProperty({
        description: 'Sales Representative ID',
        example: 100001040,
    })
    @IsNumber()
    @IsNotEmpty()
    SALESREP_ID: number;

    @ApiProperty({
        description: 'Ship From Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Ship To Organization ID',
        example: 7065,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Sold From Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Sold To Organization ID',
        example: 8043,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Transactional Currency Code',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    TRANSACTIONAL_CURR_CODE: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    OPERATION: string;

    @ApiProperty({
        description: 'Flow Status Code',
        example: 'ENTERED',
    })
    @IsString()
    @IsNotEmpty()
    FLOW_STATUS_CODE: string;

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

export class SalesOrderHeaderResponseDto {
    @ApiProperty({
        description: 'Header Interface ID',
        example: 1001,
    })
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Attribute 13',
        example: 'JAT/CP/2024/01/000001',
    })
    ATTRIBUTE13: string;

    @ApiProperty({
        description: 'Attribute 14',
        example: 'JAT/SO/2024/01/000001',
    })
    ATTRIBUTE14: string;

    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Context',
        example: 'NNA FPPR',
    })
    CONTEXT: string;

    @ApiProperty({
        description: 'Invoice To Organization ID',
        example: 29048,
    })
    INVOICE_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Order Category Code',
        example: 'ORDER',
    })
    ORDER_CATEGORY_CODE: string;

    @ApiProperty({
        description: 'Ordered Date',
        example: '2024-01-01T00:00:00.000Z',
    })
    ORDERED_DATE: string;

    @ApiProperty({
        description: 'Order Type ID',
        example: 1062,
    })
    ORDER_TYPE_ID: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 125,
    })
    ORG_ID: number;

    @ApiProperty({
        description: 'Payment Term ID',
        example: 1004,
    })
    PAYMENT_TERM_ID: number;

    @ApiProperty({
        description: 'Price List ID',
        example: 14025,
    })
    PRICE_LIST_ID: number;

    @ApiProperty({
        description: 'Pricing Date',
        example: '2024-01-01T00:00:00.000Z',
    })
    PRICING_DATE: string;

    @ApiProperty({
        description: 'Sales Representative ID',
        example: 100001040,
    })
    SALESREP_ID: number;

    @ApiProperty({
        description: 'Ship From Organization ID',
        example: 241,
    })
    SHIP_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Ship To Organization ID',
        example: 7065,
    })
    SHIP_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Sold From Organization ID',
        example: 125,
    })
    SOLD_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Sold To Organization ID',
        example: 8043,
    })
    SOLD_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Transactional Currency Code',
        example: 'IDR',
    })
    TRANSACTIONAL_CURR_CODE: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    OPERATION: string;

    @ApiProperty({
        description: 'Flow Status Code',
        example: 'ENTERED',
    })
    FLOW_STATUS_CODE: string;

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
        description: 'Last Updated By',
        example: 1234,
    })
    LAST_UPDATED_BY: number;
}

export class CreateSalesOrderLineDto {
    @ApiProperty({
        description: 'Header Interface ID',
        example: 12345,
    })
    @IsNumber()
    @IsNotEmpty()
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    @IsString()
    @IsNotEmpty()
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    OPERATION: string;

    @ApiProperty({
        description: 'Line Category Code',
        example: 'ORDER',
    })
    @IsString()
    @IsNotEmpty()
    LINE_CATEGORY_CODE: string;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Line Type ID',
        example: 1141,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_TYPE_ID: number;

    @ApiProperty({
        description: 'Ordered Quantity',
        example: 100,
    })
    @IsNumber()
    @IsNotEmpty()
    ORDERED_QUANTITY: number;

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
        description: 'Interface Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    IFACE_OPERATION: string;
}

export class SalesOrderLineResponseDto {
    @ApiProperty({
        description: 'Line Interface ID',
        example: 2001,
    })
    LINE_IFACE_ID: number;

    @ApiProperty({
        description: 'Header Interface ID',
        example: 12345,
    })
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    OPERATION: string;

    @ApiProperty({
        description: 'Line Category Code',
        example: 'ORDER',
    })
    LINE_CATEGORY_CODE: string;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Line Type ID',
        example: 1141,
    })
    LINE_TYPE_ID: number;

    @ApiProperty({
        description: 'Ordered Quantity',
        example: 100,
    })
    ORDERED_QUANTITY: number;

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
        description: 'Interface Operation',
        example: 'CREATE',
    })
    IFACE_OPERATION: string;

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

export class CreateSalesOrderLineItemDto {
    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    @IsString()
    @IsNotEmpty()
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    OPERATION: string;

    @ApiProperty({
        description: 'Line Category Code',
        example: 'ORDER',
    })
    @IsString()
    @IsNotEmpty()
    LINE_CATEGORY_CODE: string;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Line Type ID',
        example: 1141,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_TYPE_ID: number;

    @ApiProperty({
        description: 'Ordered Quantity',
        example: 100,
    })
    @IsNumber()
    @IsNotEmpty()
    ORDERED_QUANTITY: number;

    @ApiProperty({
        description: 'Source Line ID',
        example: '1234567891',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_LINE_ID: string;

    @ApiProperty({
        description: 'Interface Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    IFACE_OPERATION: string;
}

export class CreateSalesOrderWithLinesDto {
    @ApiProperty({
        description: 'Attribute 13 - Call Plan Number',
        example: 'JAT/CP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14 - Sales Order Number',
        example: 'JAT/SO/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    @IsString()
    @IsNotEmpty()
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Context',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    CONTEXT: string;

    @ApiProperty({
        description: 'Invoice To Organization ID',
        example: 29048,
    })
    @IsNumber()
    @IsNotEmpty()
    INVOICE_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Order Category Code',
        example: 'ORDER',
    })
    @IsString()
    @IsNotEmpty()
    ORDER_CATEGORY_CODE: string;

    @ApiProperty({
        description: 'Ordered Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    ORDERED_DATE: string;

    @ApiProperty({
        description: 'Order Type ID',
        example: 1062,
    })
    @IsNumber()
    @IsNotEmpty()
    ORDER_TYPE_ID: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;

    @ApiProperty({
        description: 'Payment Term ID',
        example: 1004,
    })
    @IsNumber()
    @IsNotEmpty()
    PAYMENT_TERM_ID: number;

    @ApiProperty({
        description: 'Price List ID',
        example: 14025,
    })
    @IsNumber()
    @IsNotEmpty()
    PRICE_LIST_ID: number;

    @ApiProperty({
        description: 'Pricing Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    PRICING_DATE: string;

    @ApiProperty({
        description: 'Sales Representative ID',
        example: 100001040,
    })
    @IsNumber()
    @IsNotEmpty()
    SALESREP_ID: number;

    @ApiProperty({
        description: 'Ship From Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Ship To Organization ID',
        example: 7065,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Sold From Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Sold To Organization ID',
        example: 8043,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Transactional Currency Code',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    TRANSACTIONAL_CURR_CODE: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    OPERATION: string;

    @ApiProperty({
        description: 'Flow Status Code',
        example: 'ENTERED',
    })
    @IsString()
    @IsNotEmpty()
    FLOW_STATUS_CODE: string;

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
        description: 'Sales Order Lines',
        type: [CreateSalesOrderLineItemDto],
        example: [
            {
                BOOKED_FLAG: 'N',
                OPERATION: 'CREATE',
                LINE_CATEGORY_CODE: 'ORDER',
                LINE_NUMBER: 1,
                LINE_TYPE_ID: 1141,
                ORDERED_QUANTITY: 100,
                SOURCE_LINE_ID: '1234567891',
                IFACE_OPERATION: 'CREATE'
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSalesOrderLineItemDto)
    @IsNotEmpty()
    lines: CreateSalesOrderLineItemDto[];
}

export class SalesOrderWithLinesResponseDto {
    @ApiProperty({
        description: 'Sales Order Header',
        type: SalesOrderHeaderResponseDto,
    })
    header: SalesOrderHeaderResponseDto;

    @ApiProperty({
        description: 'Sales Order Lines',
        type: [SalesOrderLineResponseDto],
    })
    lines: SalesOrderLineResponseDto[];
}

export class CreateSalesOrderReturnHeaderDto {
    @ApiProperty({
        description: 'Attribute 13 - Call Plan Number',
        example: 'JAT/CP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14 - Sales Order Number',
        example: 'JAT/SO/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    @IsString()
    @IsNotEmpty()
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Context',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    CONTEXT: string;

    @ApiProperty({
        description: 'Invoice To Organization ID',
        example: 29048,
    })
    @IsNumber()
    @IsNotEmpty()
    INVOICE_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Ordered Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    ORDERED_DATE: string;

    @ApiProperty({
        description: 'Order Type ID',
        example: 1062,
    })
    @IsNumber()
    @IsNotEmpty()
    ORDER_TYPE_ID: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;

    @ApiProperty({
        description: 'Payment Term ID',
        example: 1004,
    })
    @IsNumber()
    @IsNotEmpty()
    PAYMENT_TERM_ID: number;

    @ApiProperty({
        description: 'Price List ID',
        example: 14025,
    })
    @IsNumber()
    @IsNotEmpty()
    PRICE_LIST_ID: number;

    @ApiProperty({
        description: 'Pricing Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    PRICING_DATE: string;

    @ApiProperty({
        description: 'Sales Representative ID',
        example: 100001040,
    })
    @IsNumber()
    @IsNotEmpty()
    SALESREP_ID: number;

    @ApiProperty({
        description: 'Ship From Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Ship To Organization ID',
        example: 7065,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Sold From Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Sold To Organization ID',
        example: 8043,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Transactional Currency Code',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    TRANSACTIONAL_CURR_CODE: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    OPERATION: string;

    @ApiProperty({
        description: 'Flow Status Code',
        example: 'ENTERED',
    })
    @IsString()
    @IsNotEmpty()
    FLOW_STATUS_CODE: string;

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
        description: 'Interface Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    IFACE_OPERATION: string;
}

export class CreateSalesOrderReturnLineItemDto {
    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    @IsString()
    @IsNotEmpty()
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    OPERATION: string;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Line Type ID',
        example: 1141,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_TYPE_ID: number;

    @ApiProperty({
        description: 'Ordered Quantity',
        example: 100,
    })
    @IsNumber()
    @IsNotEmpty()
    ORDERED_QUANTITY: number;

    @ApiProperty({
        description: 'Source Line ID',
        example: '1234567891',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_LINE_ID: string;

    @ApiProperty({
        description: 'Interface Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    IFACE_OPERATION: string;

    @ApiProperty({
        description: 'Attribute 11 - Stock Condition (GS/BS)',
        example: 'GS',
        enum: ['GS', 'BS'],
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE11: string;
}

export class CreateSalesOrderReturnDto {
    @ApiProperty({
        description: 'Attribute 13 - Call Plan Number',
        example: 'JAT/CP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14 - Sales Order Number',
        example: 'JAT/SO/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Booked Flag',
        example: 'N',
    })
    @IsString()
    @IsNotEmpty()
    BOOKED_FLAG: string;

    @ApiProperty({
        description: 'Context',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    CONTEXT: string;

    @ApiProperty({
        description: 'Invoice To Organization ID',
        example: 29048,
    })
    @IsNumber()
    @IsNotEmpty()
    INVOICE_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Ordered Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    ORDERED_DATE: string;

    @ApiProperty({
        description: 'Order Type ID',
        example: 1062,
    })
    @IsNumber()
    @IsNotEmpty()
    ORDER_TYPE_ID: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    ORG_ID: number;

    @ApiProperty({
        description: 'Payment Term ID',
        example: 1004,
    })
    @IsNumber()
    @IsNotEmpty()
    PAYMENT_TERM_ID: number;

    @ApiProperty({
        description: 'Price List ID',
        example: 14025,
    })
    @IsNumber()
    @IsNotEmpty()
    PRICE_LIST_ID: number;

    @ApiProperty({
        description: 'Pricing Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    PRICING_DATE: string;

    @ApiProperty({
        description: 'Sales Representative ID',
        example: 100001040,
    })
    @IsNumber()
    @IsNotEmpty()
    SALESREP_ID: number;

    @ApiProperty({
        description: 'Ship From Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Ship To Organization ID',
        example: 7065,
    })
    @IsNumber()
    @IsNotEmpty()
    SHIP_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Sold From Organization ID',
        example: 125,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_FROM_ORG_ID: number;

    @ApiProperty({
        description: 'Sold To Organization ID',
        example: 8043,
    })
    @IsNumber()
    @IsNotEmpty()
    SOLD_TO_ORG_ID: number;

    @ApiProperty({
        description: 'Transactional Currency Code',
        example: 'IDR',
    })
    @IsString()
    @IsNotEmpty()
    TRANSACTIONAL_CURR_CODE: string;

    @ApiProperty({
        description: 'Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    OPERATION: string;

    @ApiProperty({
        description: 'Flow Status Code',
        example: 'ENTERED',
    })
    @IsString()
    @IsNotEmpty()
    FLOW_STATUS_CODE: string;

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
        description: 'Interface Operation',
        example: 'CREATE',
    })
    @IsString()
    @IsNotEmpty()
    IFACE_OPERATION: string;

    @ApiProperty({
        description: 'Return Lines',
        type: [CreateSalesOrderReturnLineItemDto],
        example: [
            {
                BOOKED_FLAG: 'N',
                OPERATION: 'CREATE',
                LINE_NUMBER: 1,
                LINE_TYPE_ID: 1141,
                ORDERED_QUANTITY: 100,
                SOURCE_LINE_ID: '1234567891',
                IFACE_OPERATION: 'CREATE',
                ATTRIBUTE11: 'GS'
            }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSalesOrderReturnLineItemDto)
    @IsNotEmpty()
    lines: CreateSalesOrderReturnLineItemDto[];
}
