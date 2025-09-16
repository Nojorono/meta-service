import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class WeekSalesDto {
    @ApiProperty({
        description: 'Month',
        example: '01',
    })
    BULAN: string;

    @ApiProperty({
        description: 'Week',
        example: '01',
    })
    MINGGU: string;

    @ApiProperty({
        description: 'Quarter',
        example: 1,
    })
    QUARTER: number;

    @ApiProperty({
        description: 'Year',
        example: '2024',
    })
    TAHUN: string;

    @ApiProperty({
        description: 'Week end date',
        example: '2024-01-07T00:00:00.000Z',
    })
    TANGGAL_AKHIR_MINGGU: Date;

    @ApiProperty({
        description: 'Real week end date',
        example: '2024-01-07T00:00:00.000Z',
    })
    TANGGAL_AKHIR_MINGGU_REAL: Date;

    @ApiProperty({
        description: 'Week start date',
        example: '2024-01-01T00:00:00.000Z',
    })
    TANGGAL_AWAL_MINGGU: Date;

    @ApiProperty({
        description: 'Real week start date',
        example: '2024-01-01T00:00:00.000Z',
    })
    TANGGAL_AWAL_MINGGU_REAL: Date;
}

export class WeekSalesQueryDto {
    @ApiPropertyOptional({
        description: 'Year to filter by',
        example: '2024',
    })
    @IsOptional()
    @IsString()
    tahun?: string;

    @ApiPropertyOptional({
        description: 'Search term for week or month',
        example: '01',
    })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({
        description: 'Page number for pagination',
        example: 1,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    page?: number;

    @ApiPropertyOptional({
        description: 'Number of items per page',
        example: 10,
    })
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    limit?: number;
}

export class WeekSalesResponseDto {
    @ApiProperty({
        description: 'Array of week sales data',
        type: [WeekSalesDto],
    })
    data: WeekSalesDto[];

    @ApiProperty({
        description: 'Total count of records',
        example: 52,
    })
    count: number;

    @ApiProperty({
        description: 'Success status',
        example: true,
    })
    status: boolean;

    @ApiProperty({
        description: 'Response message',
        example: 'Week sales data retrieved successfully',
    })
    message: string;
}
