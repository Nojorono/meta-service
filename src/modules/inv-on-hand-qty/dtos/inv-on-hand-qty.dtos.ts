import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuantityConversionDto {
    @ApiProperty({ description: 'UOM Code', example: 'DUS' })
    @IsString()
    UOM_CODE: string;

    @ApiProperty({ description: 'Quantity in this UOM', example: 51 })
    @IsNumber()
    QUANTITY: number;
}

export class ItemDto {
    @ApiProperty({ description: 'Item Code', example: 'CLM16' })
    @IsString()
    ITEM_CODE: string;

    @ApiProperty({ description: 'Quantity in base UOM', example: 109200 })
    @IsNumber()
    QUANTITY: number;

    @ApiProperty({ description: 'Unit of Measure', example: 'BKS' })
    @IsString()
    UOM: string;

    @ApiProperty({
        description: 'Quantity conversions to different UOMs',
        type: [QuantityConversionDto]
    })
    QUANTITY_CONVERTION: QuantityConversionDto[];
}

export class InvOnHandQtyDto {
    @ApiProperty({ description: 'Subinventory Code', example: 'GD-RK-PRE' })
    @IsString()
    SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'Array of items in this subinventory',
        type: [ItemDto]
    })
    ITEM: ItemDto[];
}

export class InvOnHandQtyParamsDto {
    @ApiPropertyOptional({
        description: 'Item Code to filter',
        example: 'CLM16'
    })
    @IsString()
    @IsOptional()
    item_code?: string;

    @ApiPropertyOptional({
        description: 'Subinventory Code to filter',
        example: 'GOOD-RK-1'
    })
    @IsString()
    @IsOptional()
    subinventory_code?: string;
}

export class InvOnHandQtyResponseDto {
    @ApiProperty({
        description: 'Array of inventory on hand quantity data',
        type: [InvOnHandQtyDto],
    })
    data: InvOnHandQtyDto[];

    @ApiProperty({ description: 'Total count of records', example: 2 })
    count: number;

    @ApiProperty({
        description: 'Response message',
        example: 'ON_HAND_QUANTITY data retrieved successfully',
    })
    message: string;

    @ApiProperty({ description: 'Response status', example: true })
    status: boolean;
}
