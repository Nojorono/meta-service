import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

// Base DTO with common fields
export class CreateInvTransactionBaseDto {
    @ApiProperty({
        description: 'Source Code',
        example: 'DMS',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_CODE: string;

    @ApiProperty({
        description: 'Source Line ID',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    SOURCE_LINE_ID: number;

    @ApiProperty({
        description: 'Source Header ID',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    SOURCE_HEADER_ID: number;

    @ApiProperty({
        description: 'Process Flag',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    PROCESS_FLAG: number;

    @ApiProperty({
        description: 'Transaction Mode',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_MODE: number;

    @ApiProperty({
        description: 'Lock Flag',
        example: 2,
    })
    @IsNumber()
    @IsNotEmpty()
    LOCK_FLAG: number;

    @ApiProperty({
        description: 'Inventory Item ID',
        example: 21001,
    })
    @IsNumber()
    @IsNotEmpty()
    INVENTORY_ITEM_ID: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    ORGANIZATION_ID: number;

    @ApiProperty({
        description: 'Transaction Quantity',
        example: 3,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_QUANTITY: number;

    @ApiProperty({
        description: 'Transaction UOM',
        example: 'BKS',
    })
    @IsString()
    @IsNotEmpty()
    TRANSACTION_UOM: string;

    @ApiProperty({
        description: 'Transaction Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    TRANSACTION_DATE: string;

    @ApiProperty({
        description: 'Subinventory Code',
        example: 'CANVAS',
    })
    @IsString()
    @IsNotEmpty()
    SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'Locator ID',
        example: 265,
    })
    @IsNumber()
    @IsNotEmpty()
    LOCATOR_ID: number;

    @ApiProperty({
        description: 'Transaction Source Name',
        example: 'JAT/PR/2023/09/005097',
    })
    @IsString()
    @IsNotEmpty()
    TRANSACTION_SOURCE_NAME: string;

    @ApiProperty({
        description: 'Transaction Type ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_TYPE_ID: number;

    @ApiProperty({
        description: 'Transaction Reference',
        example: 'DMS',
    })
    @IsString()
    @IsNotEmpty()
    TRANSACTION_REFERENCE: string;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'NNA FPPR',
    })
    @IsString()
    @IsNotEmpty()
    ATTRIBUTE_CATEGORY: string;

    @ApiProperty({
        description: 'Attribute 13',
        example: 'JAT/CP/2023/09/005097',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14',
        example: 'JAT/PR/2023/09/005097',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Source System',
        example: 'DMS',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_SYSTEM: string;

    @ApiProperty({
        description: 'Source Header Interface ID',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_HEADER_IFACE_ID: string;

    @ApiProperty({
        description: 'Source Line Interface ID',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_LINE_IFACE_ID: string;

    @ApiProperty({
        description: 'Source Batch Interface ID',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    SOURCE_BATCH_IFACE_ID: string;
}

// Transfer Receipt DTO
export class CreateTrfReceiptDto extends CreateInvTransactionBaseDto {
    @ApiProperty({
        description: 'Distribution Account ID',
        example: 51845,
    })
    @IsNumber()
    @IsNotEmpty()
    DISTRIBUTION_ACCOUNT_ID: number;
}

// Transfer Issue DTO (negative quantity)
export class CreateTrfIssueDto extends CreateInvTransactionBaseDto {
    @ApiProperty({
        description: 'Distribution Account ID',
        example: 51845,
    })
    @IsNumber()
    @IsNotEmpty()
    DISTRIBUTION_ACCOUNT_ID: number;
}

// Return Bad DTO
export class CreateReturnBadDto extends CreateInvTransactionBaseDto {
    @ApiProperty({
        description: 'Transfer Subinventory',
        example: 'BAD-ROKOK',
    })
    @IsString()
    @IsNotEmpty()
    TRANSFER_SUBINVENTORY: string;

    @ApiProperty({
        description: 'Transfer Organization',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSFER_ORGANIZATION: number;

    @ApiProperty({
        description: 'Transfer Locator',
        example: 301,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSFER_LOCATOR: number;

    @ApiProperty({
        description: 'Attribute 6',
        example: '10000',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE6?: string;

    @ApiProperty({
        description: 'Attribute 7',
        example: '2024',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE7?: string;

    @ApiProperty({
        description: 'Attribute 10',
        example: 'BS',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE10?: string;
}

// Return Good DTO
export class CreateReturnGoodDto extends CreateInvTransactionBaseDto {
    @ApiProperty({
        description: 'Transfer Subinventory',
        example: 'KECIL',
    })
    @IsString()
    @IsNotEmpty()
    TRANSFER_SUBINVENTORY: string;

    @ApiProperty({
        description: 'Transfer Organization',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSFER_ORGANIZATION: number;

    @ApiProperty({
        description: 'Transfer Locator',
        example: 224,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSFER_LOCATOR: number;
}

// Correction DTO
export class CreateCorrectionDto extends CreateInvTransactionBaseDto {
    @ApiProperty({
        description: 'Transfer Subinventory',
        example: 'KECIL',
    })
    @IsString()
    @IsNotEmpty()
    TRANSFER_SUBINVENTORY: string;

    @ApiProperty({
        description: 'Transfer Organization',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSFER_ORGANIZATION: number;

    @ApiProperty({
        description: 'Transfer Locator',
        example: 224,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSFER_LOCATOR: number;
}

// Response DTOs
export class InvTransactionResponseDto {
    @ApiProperty({
        description: 'Source Code',
        example: 'DMS',
    })
    SOURCE_CODE: string;

    @ApiProperty({
        description: 'Source Line ID',
        example: 1,
    })
    SOURCE_LINE_ID: number;

    @ApiProperty({
        description: 'Source Header ID',
        example: 1,
    })
    SOURCE_HEADER_ID: number;

    @ApiProperty({
        description: 'Process Flag',
        example: 1,
    })
    PROCESS_FLAG: number;

    @ApiProperty({
        description: 'Transaction Mode',
        example: 1,
    })
    TRANSACTION_MODE: number;

    @ApiProperty({
        description: 'Lock Flag',
        example: 2,
    })
    LOCK_FLAG: number;

    @ApiProperty({
        description: 'Inventory Item ID',
        example: 21001,
    })
    INVENTORY_ITEM_ID: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 241,
    })
    ORGANIZATION_ID: number;

    @ApiProperty({
        description: 'Transaction Quantity',
        example: 3,
    })
    TRANSACTION_QUANTITY: number;

    @ApiProperty({
        description: 'Transaction UOM',
        example: 'BKS',
    })
    TRANSACTION_UOM: string;

    @ApiProperty({
        description: 'Transaction Date',
        example: '2024-01-01T00:00:00.000Z',
    })
    TRANSACTION_DATE: string;

    @ApiProperty({
        description: 'Subinventory Code',
        example: 'CANVAS',
    })
    SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'Locator ID',
        example: 265,
    })
    LOCATOR_ID: number;

    @ApiProperty({
        description: 'Transaction Source Name',
        example: 'JAT/PR/2023/09/005097',
    })
    TRANSACTION_SOURCE_NAME: string;

    @ApiProperty({
        description: 'Transaction Type ID',
        example: 241,
    })
    TRANSACTION_TYPE_ID: number;

    @ApiProperty({
        description: 'Transaction Reference',
        example: 'DMS',
    })
    TRANSACTION_REFERENCE: string;

    @ApiProperty({
        description: 'Distribution Account ID',
        example: 51845,
        required: false,
    })
    DISTRIBUTION_ACCOUNT_ID?: number;

    @ApiProperty({
        description: 'Transfer Subinventory',
        example: 'BAD-ROKOK',
        required: false,
    })
    TRANSFER_SUBINVENTORY?: string;

    @ApiProperty({
        description: 'Transfer Organization',
        example: 241,
        required: false,
    })
    TRANSFER_ORGANIZATION?: number;

    @ApiProperty({
        description: 'Transfer Locator',
        example: 301,
        required: false,
    })
    TRANSFER_LOCATOR?: number;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'NNA FPPR',
    })
    ATTRIBUTE_CATEGORY: string;

    @ApiProperty({
        description: 'Attribute 6',
        example: '10000',
    })
    ATTRIBUTE6: string;

    @ApiProperty({
        description: 'Attribute 7',
        example: '2024',
    })
    ATTRIBUTE7: string;

    @ApiProperty({
        description: 'Attribute 10',
        example: 'BS',
    })
    ATTRIBUTE10: string;

    @ApiProperty({
        description: 'Attribute 13',
        example: 'JAT/CP/2023/09/005097',
    })
    ATTRIBUTE13: string;

    @ApiProperty({
        description: 'Attribute 14',
        example: 'JAT/PR/2023/09/005097',
    })
    ATTRIBUTE14: string;

    @ApiProperty({
        description: 'Source System',
        example: 'DMS',
    })
    SOURCE_SYSTEM: string;

    @ApiProperty({
        description: 'Source Header Interface ID',
        example: '1234567890',
    })
    SOURCE_HEADER_IFACE_ID: string;

    @ApiProperty({
        description: 'Source Line Interface ID',
        example: '1234567890',
    })
    SOURCE_LINE_IFACE_ID: string;

    @ApiProperty({
        description: 'Source Batch Interface ID',
        example: '1234567890',
    })
    SOURCE_BATCH_IFACE_ID: string;

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
