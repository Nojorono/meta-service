import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DoValidationDto {
    @ApiProperty({
        description: 'Delivery Order Number',
        example: 'DO-2024-001',
    })
    NO_SURAT_JALAN: string;

    @ApiProperty({
        description: 'Count of distinct PO numbers',
        example: 3,
    })
    JML_NO_PO: number;

    @ApiProperty({
        description: 'List of distinct PO numbers',
        example: 'PO-001, PO-002, PO-003',
    })
    DAFTAR_NO_PO: string;
}

export class DoValidationQueryDto {
    @ApiPropertyOptional({
        description: 'Filter by specific delivery order number',
        example: 'DO-2024-001',
    })
    @IsOptional()
    @IsString()
    no_surat_jalan?: string;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
    })
    @IsOptional()
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 10,
    })
    @IsOptional()
    limit?: number;
}

export class DoValidationResponseDto {
    @ApiProperty({
        description: 'Array of DO validation data',
        type: [DoValidationDto],
    })
    data: DoValidationDto[];

    @ApiProperty({
        description: 'Total count of records',
        example: 25,
    })
    count: number;

    @ApiProperty({
        description: 'Success status',
        example: true,
    })
    status: boolean;

    @ApiProperty({
        description: 'Response message',
        example: 'DO validation data retrieved successfully',
    })
    message: string;
}
