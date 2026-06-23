import { ApiProperty } from '@nestjs/swagger';

export class MoveOrderLineResponseDto {
    @ApiProperty({
        description: 'Line Interface ID',
        example: 2001,
    })
    LINE_IFACE_ID: number;

    @ApiProperty({
        description: 'Header Interface ID',
        example: 1001,
    })
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 241,
    })
    ORGANIZATION_ID: number;

    @ApiProperty({
        description: 'Inventory Item ID',
        example: 21001,
    })
    INVENTORY_ITEM_ID: number;

    @ApiProperty({
        description: 'From Subinventory Code',
        example: 'KECIL',
    })
    FROM_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'To Subinventory Code',
        example: 'CANVAS',
    })
    TO_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'UOM Code',
        example: 'BKS',
    })
    UOM_CODE: string;

    @ApiProperty({
        description: 'Quantity',
        example: 1000,
    })
    QUANTITY: number;

    @ApiProperty({
        description: 'Transaction Type ID',
        example: 121,
    })
    TRANSACTION_TYPE_ID: number;

    @ApiProperty({
        description: 'Line Status',
        example: 7,
    })
    LINE_STATUS: number;

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
