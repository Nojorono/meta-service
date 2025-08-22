import { Body, Controller, Get, Post, Put, Delete, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MoveOrderService } from '../services/move-order.service';
import {
    CreateMoveOrderDto,
    MoveOrderResponseDto,
    UpdateMoveOrderDto,
    GetMoveOrdersQueryDto,
    CreateMoveOrderLineDto,
    MoveOrderLineResponseDto,
    UpdateMoveOrderLineDto,
    GetMoveOrderLinesQueryDto,
    CreateMoveOrderWithLinesDto,
    MoveOrderWithLinesResponseDto
} from '../dtos/move-order.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Move Orders')
@Controller('move-orders')
@Public()
export class MoveOrderController {
    constructor(private readonly moveOrderService: MoveOrderService) { }

    @Post()
    @ApiOperation({ summary: 'Create Move Order' })
    @ApiResponse({
        status: 201,
        description: 'Move Order created successfully',
        type: MoveOrderResponseDto,
    })
    async createMoveOrder(@Body() createDto: CreateMoveOrderDto): Promise<MoveOrderResponseDto> {
        const result = await this.moveOrderService.createMoveOrder(createDto);
        return result;
    }

    @Post('with-lines')
    @ApiOperation({
        summary: 'Create Move Order with Lines',
        description: 'Creates a move order header first, then creates all associated lines using the returned HEADER_IFACE_ID'
    })
    @ApiResponse({
        status: 201,
        description: 'Move Order with Lines created successfully',
        type: MoveOrderWithLinesResponseDto,
    })
    async createMoveOrderWithLines(@Body() createDto: CreateMoveOrderWithLinesDto): Promise<MoveOrderWithLinesResponseDto> {

        if (!createDto.lines || createDto.lines.length === 0) {
            throw new Error('Lines array is required and must contain at least one line');
        }

        // Check for null values in lines
        const nullLineIndices = createDto.lines
            .map((line, index) => line === null || line === undefined ? index : -1)
            .filter(index => index !== -1);

        if (nullLineIndices.length > 0) {
            throw new Error(`Lines at indices ${nullLineIndices.join(', ')} are null or undefined`);
        }

        const result = await this.moveOrderService.createMoveOrderWithLines(createDto);
        return result;
    }

    @Post('lines')
    @ApiOperation({ summary: 'Create Move Order Line' })
    @ApiResponse({
        status: 201,
        description: 'Move Order Line created successfully',
        type: MoveOrderLineResponseDto,
    })
    async createMoveOrderLine(@Body() createDto: CreateMoveOrderLineDto): Promise<MoveOrderLineResponseDto> {
        const result = await this.moveOrderService.createMoveOrderLine(createDto);
        return result;
    }
}
