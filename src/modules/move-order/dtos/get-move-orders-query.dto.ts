import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString, IsOptional } from 'class-validator';

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
