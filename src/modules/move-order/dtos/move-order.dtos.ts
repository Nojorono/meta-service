import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsNotEmpty, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMoveOrderDto {

    @ApiProperty({
        description: 'Request Number',
        example: 'JAT/SPB/2024/01/000002',
    })
    @IsString()
    @IsNotEmpty()
    REQUEST_NUMBER: string;

    @ApiProperty({
        description: 'Transaction Type ID',
        example: 121,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_TYPE_ID: number;

    @ApiProperty({
        description: 'Move Order Type',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    MOVE_ORDER_TYPE: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    ORGANIZATION_ID: number;

    @ApiProperty({
        description: 'Description',
        example: 'Move order description',
        required: false,
    })
    @IsString()
    @IsOptional()
    DESCRIPTION?: string;

    @ApiProperty({
        description: 'Date Required',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    DATE_REQUIRED: string;

    @ApiProperty({
        description: 'From Subinventory Code',
        example: 'KECIL',
    })
    @IsString()
    @IsNotEmpty()
    FROM_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'To Subinventory Code',
        example: 'CANVAS',
    })
    @IsString()
    @IsNotEmpty()
    TO_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'To Account ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_ACCOUNT_ID?: number;

    @ApiProperty({
        description: 'Grouping Rule ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    GROUPING_RULE_ID?: number;

    @ApiProperty({
        description: 'Ship To Location ID',
        example: 1001,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SHIP_TO_LOCATION_ID?: number;

    @ApiProperty({
        description: 'Reference ID',
        example: 5001,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    REFERENCE_ID?: number;

    @ApiProperty({
        description: 'Header Status',
        example: 7,
    })
    @IsNumber()
    @IsNotEmpty()
    HEADER_STATUS: number;

    @ApiProperty({
        description: 'Status Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    STATUS_DATE: string;

    @ApiProperty({
        description: 'Attribute Category',
        example: 'FPPR Tambahan',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE_CATEGORY?: string;

    @ApiProperty({
        description: 'Attribute 1',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE1?: string;

    @ApiProperty({
        description: 'Attribute 2',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE2?: string;

    @ApiProperty({
        description: 'Attribute 3',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE3?: string;

    @ApiProperty({
        description: 'Attribute 4',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE4?: string;

    @ApiProperty({
        description: 'Attribute 5',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE5?: string;

    @ApiProperty({
        description: 'Attribute 6',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE6?: string;

    @ApiProperty({
        description: 'Attribute 7',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE7?: string;

    @ApiProperty({
        description: 'Attribute 8',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE8?: string;

    @ApiProperty({
        description: 'Attribute 9',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE9?: string;

    @ApiProperty({
        description: 'Attribute 10',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE10?: string;

    @ApiProperty({
        description: 'Attribute 11',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE11?: string;

    @ApiProperty({
        description: 'Attribute 12',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE12?: string;

    @ApiProperty({
        description: 'Attribute 13 - Call Plan Number',
        example: 'JAT/CP/2024/01/000001',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14 - SPB Number (Source Document)',
        example: 'JAT/SPB/2024/01/000002',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Attribute 15 - For Internal Oracle',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE15?: string;

    @ApiProperty({
        description: 'Program Application ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PROGRAM_APPLICATION_ID?: number;

    @ApiProperty({
        description: 'Program ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PROGRAM_ID?: number;

    @ApiProperty({
        description: 'Program Update Date',
        example: '2024-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    PROGRAM_UPDATE_DATE?: string;

    @ApiProperty({
        description: 'Source Header ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_HEADER_ID?: string;

    @ApiProperty({
        description: 'Source Line ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_LINE_ID?: string;

    @ApiProperty({
        description: 'Source Batch ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_BATCH_ID?: string;
}

export class MoveOrderResponseDto {
    @ApiProperty({
        description: 'Header Interface ID',
        example: 1001,
    })
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Request Number',
        example: 'JAT/SPB/2024/01/000002',
    })
    REQUEST_NUMBER: string;

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

export class UpdateMoveOrderDto {
    @ApiProperty({
        description: 'Description',
        example: 'Updated description',
        required: false,
    })
    @IsString()
    @IsOptional()
    DESCRIPTION?: string;

    @ApiProperty({
        description: 'Header Status',
        example: 8,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    HEADER_STATUS?: number;

    @ApiProperty({
        description: 'Status Date',
        example: '2024-01-02',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    STATUS_DATE?: string;

    @ApiProperty({
        description: 'Interface Status',
        example: 'PROCESSED',
        required: false,
    })
    @IsString()
    @IsOptional()
    IFACE_STATUS?: string;

    @ApiProperty({
        description: 'Interface Message',
        example: 'Successfully processed',
        required: false,
    })
    @IsString()
    @IsOptional()
    IFACE_MESSAGE?: string;
}

export class GetMoveOrdersQueryDto {
    @ApiProperty({
        description: 'Request Number filter',
        example: 'JAT/SPB/2024/01/000002',
        required: false,
    })
    @IsString()
    @IsOptional()
    REQUEST_NUMBER?: string;

    @ApiProperty({
        description: 'Organization ID filter',
        example: 241,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    ORGANIZATION_ID?: number;

    @ApiProperty({
        description: 'Header Status filter',
        example: 7,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    HEADER_STATUS?: number;

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
        description: 'Date from filter',
        example: '2024-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    DATE_FROM?: string;

    @ApiProperty({
        description: 'Date to filter',
        example: '2024-12-31',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    DATE_TO?: string;

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

export class CreateMoveOrderLineDto {

    @ApiProperty({
        description: 'Header Interface ID',
        example: 12345,
    })
    @IsNumber()
    @IsNotEmpty()
    HEADER_IFACE_ID: number;

    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    ORGANIZATION_ID: number;

    @ApiProperty({
        description: 'Inventory Item ID',
        example: 21001,
    })
    @IsNumber()
    @IsNotEmpty()
    INVENTORY_ITEM_ID: number;

    @ApiProperty({
        description: 'Revision',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    REVISION?: string;

    @ApiProperty({
        description: 'From Subinventory ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    FROM_SUBINVENTORY_ID?: number;

    @ApiProperty({
        description: 'From Subinventory Code',
        example: 'KECIL',
    })
    @IsString()
    @IsNotEmpty()
    FROM_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'From Locator ID',
        example: 224,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    FROM_LOCATOR_ID?: number;

    @ApiProperty({
        description: 'To Organization ID',
        example: 241,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_ORGANIZATION_ID?: number;

    @ApiProperty({
        description: 'To Subinventory ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_SUBINVENTORY_ID?: number;

    @ApiProperty({
        description: 'To Subinventory Code',
        example: 'CANVAS',
    })
    @IsString()
    @IsNotEmpty()
    TO_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'To Locator ID',
        example: 264,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_LOCATOR_ID?: number;

    @ApiProperty({
        description: 'To Account ID',
        example: 12345,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_ACCOUNT_ID?: number;

    @ApiProperty({
        description: 'Lot Number',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    LOT_NUMBER?: string;

    @ApiProperty({
        description: 'Serial Number Start',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    SERIAL_NUMBER_START?: string;

    @ApiProperty({
        description: 'Serial Number End',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    SERIAL_NUMBER_END?: string;

    @ApiProperty({
        description: 'UOM Code',
        example: 'BKS',
    })
    @IsString()
    @IsNotEmpty()
    UOM_CODE: string;

    @ApiProperty({
        description: 'Quantity',
        example: 1000,
    })
    @IsNumber()
    @IsNotEmpty()
    QUANTITY: number;

    @ApiProperty({
        description: 'Quantity Delivered',
        example: 0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    QUANTITY_DELIVERED?: number;

    @ApiProperty({
        description: 'Quantity Detailed',
        example: 0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    QUANTITY_DETAILED?: number;

    @ApiProperty({
        description: 'Date Required',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    DATE_REQUIRED: string;

    @ApiProperty({
        description: 'Reason ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    REASON_ID?: number;

    @ApiProperty({
        description: 'Reference ID',
        example: 5001,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    REFERENCE_ID?: number;

    @ApiProperty({
        description: 'Reference',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    REFERENCE?: string;

    @ApiProperty({
        description: 'Reference Type Code',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    REFERENCE_TYPE_CODE?: number;

    @ApiProperty({
        description: 'Project ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PROJECT_ID?: number;

    @ApiProperty({
        description: 'Task ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TASK_ID?: number;

    @ApiProperty({
        description: 'Transaction Header ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TRANSACTION_HEADER_ID?: number;

    @ApiProperty({
        description: 'Transaction Source ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TXN_SOURCE_ID?: number;

    @ApiProperty({
        description: 'Transaction Source Line ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TXN_SOURCE_LINE_ID?: number;

    @ApiProperty({
        description: 'Transaction Source Line Detail ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TXN_SOURCE_LINE_DETAIL_ID?: number;

    @ApiProperty({
        description: 'Transaction Type ID',
        example: 121,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_TYPE_ID: number;

    @ApiProperty({
        description: 'Transaction Source Type ID',
        example: 4,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_SOURCE_TYPE_ID: number;

    @ApiProperty({
        description: 'Primary Quantity',
        example: 1000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PRIMARY_QUANTITY?: number;

    @ApiProperty({
        description: 'Put Away Strategy ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PUT_AWAY_STRATEGY_ID?: number;

    @ApiProperty({
        description: 'Pick Strategy ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PICK_STRATEGY_ID?: number;

    @ApiProperty({
        description: 'Unit Number',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    UNIT_NUMBER?: string;

    @ApiProperty({
        description: 'Ship To Location ID',
        example: 1001,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SHIP_TO_LOCATION_ID?: number;

    @ApiProperty({
        description: 'From Cost Group ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    FROM_COST_GROUP_ID?: number;

    @ApiProperty({
        description: 'To Cost Group ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_COST_GROUP_ID?: number;

    @ApiProperty({
        description: 'LPN ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    LPN_ID?: number;

    @ApiProperty({
        description: 'To LPN ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_LPN_ID?: number;

    @ApiProperty({
        description: 'Pick Methodology ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PICK_METHODOLOGY_ID?: number;

    @ApiProperty({
        description: 'Container Item ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    CONTAINER_ITEM_ID?: number;

    @ApiProperty({
        description: 'Carton Grouping ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    CARTON_GROUPING_ID?: number;

    @ApiProperty({
        description: 'Line Status',
        example: 7,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_STATUS: number;

    @ApiProperty({
        description: 'Status Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    STATUS_DATE: string;

    @ApiProperty({
        description: 'Inspection Status',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    INSPECTION_STATUS?: number;

    @ApiProperty({
        description: 'WMS Process Flag',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    WMS_PROCESS_FLAG?: number;

    @ApiProperty({
        description: 'Pick Slip Number',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PICK_SLIP_NUMBER?: number;

    @ApiProperty({
        description: 'Pick Slip Date',
        example: '2024-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    PICK_SLIP_DATE?: string;

    @ApiProperty({
        description: 'Ship Set ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SHIP_SET_ID?: number;

    @ApiProperty({
        description: 'Ship Model ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SHIP_MODEL_ID?: number;

    @ApiProperty({
        description: 'Model Quantity',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    MODEL_QUANTITY?: number;

    @ApiProperty({
        description: 'Required Quantity',
        example: 1000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    REQUIRED_QUANTITY?: number;

    @ApiProperty({
        description: 'Secondary UOM',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    SECONDARY_UOM?: string;

    @ApiProperty({
        description: 'Secondary Quantity',
        example: 0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SECONDARY_QUANTITY?: number;

    @ApiProperty({
        description: 'Secondary Quantity Detailed',
        example: 0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SECONDARY_QUANTITY_DETAILED?: number;

    @ApiProperty({
        description: 'Secondary Quantity Delivered',
        example: 0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SECONDARY_QUANTITY_DELIVERED?: number;

    @ApiProperty({
        description: 'Secondary Required Quantity',
        example: 0,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    SECONDARY_REQUIRED_QUANTITY?: number;

    @ApiProperty({
        description: 'Grade Code',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    GRADE_CODE?: string;

    @ApiProperty({
        description: 'Attribute Category',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE_CATEGORY?: string;

    @ApiProperty({
        description: 'Attribute 1',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE1?: string;

    @ApiProperty({
        description: 'Attribute 2',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE2?: string;

    @ApiProperty({
        description: 'Attribute 3',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE3?: string;

    @ApiProperty({
        description: 'Attribute 4',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE4?: string;

    @ApiProperty({
        description: 'Attribute 5',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE5?: string;

    @ApiProperty({
        description: 'Attribute 6',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE6?: string;

    @ApiProperty({
        description: 'Attribute 7',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE7?: string;

    @ApiProperty({
        description: 'Attribute 8',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE8?: string;

    @ApiProperty({
        description: 'Attribute 9',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE9?: string;

    @ApiProperty({
        description: 'Attribute 10',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE10?: string;

    @ApiProperty({
        description: 'Attribute 11',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE11?: string;

    @ApiProperty({
        description: 'Attribute 12',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE12?: string;

    @ApiProperty({
        description: 'Attribute 13',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE13?: string;

    @ApiProperty({
        description: 'Attribute 14',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE14?: string;

    @ApiProperty({
        description: 'Attribute 15 - For Internal Oracle',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    ATTRIBUTE15?: string;

    @ApiProperty({
        description: 'Program Application ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PROGRAM_APPLICATION_ID?: number;

    @ApiProperty({
        description: 'Program ID',
        example: 1,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    PROGRAM_ID?: number;

    @ApiProperty({
        description: 'Program Update Date',
        example: '2024-01-01',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    PROGRAM_UPDATE_DATE?: string;

    @ApiProperty({
        description: 'Source Header ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_HEADER_ID?: string;

    @ApiProperty({
        description: 'Source Line ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_LINE_ID?: string;

    @ApiProperty({
        description: 'Source Batch ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_BATCH_ID?: string;
}

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

export class UpdateMoveOrderLineDto {
    @ApiProperty({
        description: 'Quantity',
        example: 1500,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    QUANTITY?: number;

    @ApiProperty({
        description: 'Line Status',
        example: 8,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    LINE_STATUS?: number;

    @ApiProperty({
        description: 'Status Date',
        example: '2024-01-02',
        required: false,
    })
    @IsDateString()
    @IsOptional()
    STATUS_DATE?: string;

    @ApiProperty({
        description: 'Quantity Delivered',
        example: 1000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    QUANTITY_DELIVERED?: number;

    @ApiProperty({
        description: 'Quantity Detailed',
        example: 1000,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    QUANTITY_DETAILED?: number;

    @ApiProperty({
        description: 'Interface Status',
        example: 'PROCESSED',
        required: false,
    })
    @IsString()
    @IsOptional()
    IFACE_STATUS?: string;

    @ApiProperty({
        description: 'Interface Message',
        example: 'Successfully processed',
        required: false,
    })
    @IsString()
    @IsOptional()
    IFACE_MESSAGE?: string;
}

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

export class CreateMoveOrderLineForHeaderDto {
    @ApiProperty({
        description: 'Line Number',
        example: 1,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_NUMBER: number;

    @ApiProperty({
        description: 'Organization ID',
        example: 241,
    })
    @IsNumber()
    @IsNotEmpty()
    ORGANIZATION_ID: number;

    @ApiProperty({
        description: 'Inventory Item ID',
        example: 21001,
    })
    @IsNumber()
    @IsNotEmpty()
    INVENTORY_ITEM_ID: number;

    @ApiProperty({
        description: 'From Subinventory Code',
        example: 'KECIL',
    })
    @IsString()
    @IsNotEmpty()
    FROM_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'To Subinventory Code',
        example: 'CANVAS',
    })
    @IsString()
    @IsNotEmpty()
    TO_SUBINVENTORY_CODE: string;

    @ApiProperty({
        description: 'UOM Code',
        example: 'BKS',
    })
    @IsString()
    @IsNotEmpty()
    UOM_CODE: string;

    @ApiProperty({
        description: 'Quantity',
        example: 1000,
    })
    @IsNumber()
    @IsNotEmpty()
    QUANTITY: number;

    @ApiProperty({
        description: 'Date Required',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    DATE_REQUIRED: string;

    @ApiProperty({
        description: 'Transaction Type ID',
        example: 121,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_TYPE_ID: number;

    @ApiProperty({
        description: 'Transaction Source Type ID',
        example: 4,
    })
    @IsNumber()
    @IsNotEmpty()
    TRANSACTION_SOURCE_TYPE_ID: number;

    @ApiProperty({
        description: 'Line Status',
        example: 7,
    })
    @IsNumber()
    @IsNotEmpty()
    LINE_STATUS: number;

    @ApiProperty({
        description: 'Status Date',
        example: '2024-01-01',
    })
    @IsDateString()
    @IsNotEmpty()
    STATUS_DATE: string;

    @ApiProperty({
        description: 'From Locator ID',
        example: 224,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    FROM_LOCATOR_ID?: number;

    @ApiProperty({
        description: 'To Locator ID',
        example: 264,
        required: false,
    })
    @IsNumber()
    @IsOptional()
    TO_LOCATOR_ID?: number;

    @ApiProperty({
        description: 'Revision',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    REVISION?: string;

    @ApiProperty({
        description: 'Lot Number',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    LOT_NUMBER?: string;

    @ApiProperty({
        description: 'Serial Number Start',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    SERIAL_NUMBER_START?: string;

    @ApiProperty({
        description: 'Serial Number End',
        example: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    SERIAL_NUMBER_END?: string;

    @ApiProperty({
        description: 'Source Header ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_HEADER_ID?: string;

    @ApiProperty({
        description: 'Source Line ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_LINE_ID?: string;

    @ApiProperty({
        description: 'Source Batch ID',
        example: '1234567890',
        required: false,
    })
    @IsString()
    @IsOptional()
    SOURCE_BATCH_ID?: string;
}

export class CreateMoveOrderWithLinesDto {
    @ApiProperty({
        description: 'Move Order Header Data',
        type: CreateMoveOrderDto,
        example: {
            REQUEST_NUMBER: "JAT/SPB/2024/01/000002",
            TRANSACTION_TYPE_ID: 121,
            MOVE_ORDER_TYPE: 1,
            ORGANIZATION_ID: 241,
            DESCRIPTION: "Move order description",
            DATE_REQUIRED: "2024-01-01",
            FROM_SUBINVENTORY_CODE: "KECIL",
            TO_SUBINVENTORY_CODE: "CANVAS",
            HEADER_STATUS: 7,
            STATUS_DATE: "2024-01-01"
        }
    })
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateMoveOrderDto)
    header: CreateMoveOrderDto;

    @ApiProperty({
        description: 'Move Order Lines Data - Array of line objects',
        type: [CreateMoveOrderLineForHeaderDto],
        isArray: true,
        example: [
            {
                LINE_NUMBER: 1,
                ORGANIZATION_ID: 241,
                INVENTORY_ITEM_ID: 21001,
                FROM_SUBINVENTORY_CODE: "KECIL",
                TO_SUBINVENTORY_CODE: "CANVAS",
                UOM_CODE: "BKS",
                QUANTITY: 1000,
                DATE_REQUIRED: "2024-01-01",
                TRANSACTION_TYPE_ID: 121,
                TRANSACTION_SOURCE_TYPE_ID: 4,
                LINE_STATUS: 7,
                STATUS_DATE: "2024-01-01"
            }
        ]
    })
    @IsArray()
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateMoveOrderLineForHeaderDto)
    lines: CreateMoveOrderLineForHeaderDto[];
}

export class MoveOrderWithLinesResponseDto {
    @ApiProperty({
        description: 'Created Header Information',
        type: MoveOrderResponseDto,
    })
    header: MoveOrderResponseDto;

    @ApiProperty({
        description: 'Created Lines Information',
        type: [MoveOrderLineResponseDto],
        isArray: true,
    })
    lines: MoveOrderLineResponseDto[];

    @ApiProperty({
        description: 'Summary Information',
    })
    summary: {
        totalLines: number;
        successfulLines: number;
        failedLines: number;
        errors?: string[];
    };
}
