import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

export class GetMoveOrderLinesQueryDto {
    @ApiProperty({
        description: 'Header Interface ID filter',
        example: 1001,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    HEADER_IFACE_ID?: number;

    @ApiProperty({
        description: 'Organization ID filter',
        example: 241,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    ORGANIZATION_ID?: number;

    @ApiProperty({
        description: 'Inventory Item ID filter',
        example: 21001,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    INVENTORY_ITEM_ID?: number;

    @ApiProperty({
        description: 'Line Status filter',
        example: 7,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    LINE_STATUS?: number;

    @ApiProperty({
        description: 'Interface Status filter',
        example: 'READY',
        required: false,
    })
    @IsString()
    @IsOptional()
    IFACE_STATUS?: string;

    @ApiProperty({
        description: 'From Subinventory Code filter',
        example: 'KECIL',
        required: false,
    })
    @IsString()
    @IsOptional()
    FROM_SUBINVENTORY_CODE?: string;

    @ApiProperty({
        description: 'To Subinventory Code filter',
        example: 'CANVAS',
        required: false,
    })
    @IsString()
    @IsOptional()
    TO_SUBINVENTORY_CODE?: string;

    @ApiProperty({
        description: 'Page number',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PAGE?: number;

    @ApiProperty({
        description: 'Page size',
        example: 10,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    LIMIT?: number;
}
