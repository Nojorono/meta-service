import { ApiProperty } from '@nestjs/swagger';

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
