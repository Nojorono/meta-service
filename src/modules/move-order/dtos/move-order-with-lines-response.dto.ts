import { ApiProperty } from '@nestjs/swagger';

import { MoveOrderResponseDto } from './move-order-response.dto';
import { MoveOrderLineResponseDto } from './move-order-line-response.dto';

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

