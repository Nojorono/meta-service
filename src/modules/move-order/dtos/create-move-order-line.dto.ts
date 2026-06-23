import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsString,
    IsNumber,
    IsDateString,
    IsNotEmpty,
    IsOptional,
    MaxLength,
} from 'class-validator';

export class CreateMoveOrderLineDto {
    @ApiProperty({ description: 'Header Interface ID', example: 12345 })
    @IsNumber()
    @IsNotEmpty()
    HEADER_IFACE_ID: number;

    @ApiProperty({ description: 'Line Number', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({ description: 'Organization ID', example: 241 })
    @IsNumber()
    @IsNotEmpty()
    ORGANIZATION_ID: number;

    @ApiProperty({ description: 'Inventory Item ID', example: 21001 })
    @IsNumber()
    @IsNotEmpty()
    INVENTORY_ITEM_ID: number;

    @ApiProperty({
        description: 'From Subinventory Code',
        example: 'KECIL',
        maxLength: 10,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    FROM_SUBINVENTORY_CODE: string;

    @ApiPropertyOptional({ description: 'From Locator ID', example: 224 })
    @IsNumber()
    @IsOptional()
    FROM_LOCATOR_ID?: number;

    @ApiProperty({
        description: 'To Subinventory Code',
        example: 'CANVAS',
        maxLength: 10,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(10)
    TO_SUBINVENTORY_CODE: string;

    @ApiPropertyOptional({ description: 'To Locator ID', example: 264 })
    @IsNumber()
    @IsOptional()
    TO_LOCATOR_ID?: number;

    @ApiProperty({
        description: 'UOM Code',
        example: 'BKS',
        maxLength: 3,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(3)
    UOM_CODE: string;

    @ApiProperty({ description: 'Quantity', example: 1000 })
    @IsNumber()
    @IsNotEmpty()
    QUANTITY: number;

    @ApiProperty({ description: 'Date Required', example: '2024-01-01' })
    @IsDateString()
    @IsNotEmpty()
    DATE_REQUIRED: string;

    @ApiProperty({ description: 'Transaction Type ID', example: 121 })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_TYPE_ID: number;

    @ApiProperty({ description: 'Transaction Source Type ID', example: 4 })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_SOURCE_TYPE_ID: number;

    @ApiProperty({ description: 'Line Status', example: 7 })
    @IsNumber()
    @IsNotEmpty()
    LINE_STATUS: number;

    @ApiProperty({ description: 'Status Date', example: '2024-01-01' })
    @IsDateString()
    @IsNotEmpty()
    STATUS_DATE: string;

    @ApiPropertyOptional({
        description: 'Operation',
        example: 'CREATE',
        maxLength: 30,
    })
    @IsString()
    @IsOptional()
    @MaxLength(30)
    OPERATION?: string;

    @ApiPropertyOptional({
        description: 'Database Flag',
        example: 'T',
        maxLength: 1,
    })
    @IsString()
    @IsOptional()
    @MaxLength(1)
    DB_FLAG?: string;

    @ApiPropertyOptional({
        description: 'Source System',
        example: 'WMS',
        maxLength: 100,
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    SOURCE_SYSTEM?: string;

    @ApiPropertyOptional({
        description: 'Source Header ID',
        example: '1234567890',
        maxLength: 100,
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    SOURCE_HEADER_ID?: string;

    @ApiPropertyOptional({
        description: 'Source Line ID',
        example: '1234567890',
        maxLength: 100,
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    SOURCE_LINE_ID?: string;

    @ApiPropertyOptional({
        description: 'Source Batch ID',
        example: '1234567890',
        maxLength: 100,
    })
    @IsString()
    @IsOptional()
    @MaxLength(100)
    SOURCE_BATCH_ID?: string;

    @ApiPropertyOptional({
        description: 'Interface Status',
        example: 'READY',
        maxLength: 10,
    })
    @IsString()
    @IsOptional()
    @MaxLength(10)
    IFACE_STATUS?: string;

    @ApiPropertyOptional({
        description: 'Creation Date (defaults to current date if omitted)',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsOptional()
    CREATION_DATE?: string;

    @ApiPropertyOptional({ description: 'Created By', example: 1234 })
    @IsNumber()
    @IsOptional()
    CREATED_BY?: number;

    @ApiPropertyOptional({
        description: 'Last Update Date (defaults to current date if omitted)',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsOptional()
    LAST_UPDATE_DATE?: string;

    @ApiPropertyOptional({ description: 'Last Updated By', example: 1234 })
    @IsNumber()
    @IsOptional()
    LAST_UPDATED_BY?: number;
}
