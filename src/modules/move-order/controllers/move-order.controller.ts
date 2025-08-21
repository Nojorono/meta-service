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

    @Get()
    @ApiOperation({ summary: 'Get Move Orders' })
    @ApiResponse({
        status: 200,
        description: 'Move Orders retrieved successfully',
        type: [MoveOrderResponseDto],
    })
    async getMoveOrders(@Query() queryDto: GetMoveOrdersQueryDto): Promise<MoveOrderResponseDto[]> {
        const result = await this.moveOrderService.getMoveOrders(queryDto);
        return result;
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get Move Order by ID' })
    @ApiParam({
        name: 'id',
        description: 'Header Interface ID',
        type: 'number',
        example: 1001,
    })
    @ApiResponse({
        status: 200,
        description: 'Move Order retrieved successfully',
        type: MoveOrderResponseDto,
    })
    async getMoveOrderById(@Param('id', ParseIntPipe) id: number): Promise<MoveOrderResponseDto> {
        const result = await this.moveOrderService.getMoveOrderById(id);
        return result;
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update Move Order' })
    @ApiParam({
        name: 'id',
        description: 'Header Interface ID',
        type: 'number',
        example: 1001,
    })
    @ApiResponse({
        status: 200,
        description: 'Move Order updated successfully',
        type: MoveOrderResponseDto,
    })
    async updateMoveOrder(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateMoveOrderDto
    ): Promise<MoveOrderResponseDto> {
        const result = await this.moveOrderService.updateMoveOrder(id, updateDto);
        return result;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete Move Order' })
    @ApiParam({
        name: 'id',
        description: 'Header Interface ID',
        type: 'number',
        example: 1001,
    })
    @ApiResponse({
        status: 200,
        description: 'Move Order deleted successfully',
        type: GenericResponseDto,
    })
    async deleteMoveOrder(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
        const result = await this.moveOrderService.deleteMoveOrder(id);
        return {
            success: result,
            message: result ? 'Move Order deleted successfully' : 'Failed to delete Move Order'
        };
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

    @Get('lines')
    @ApiOperation({ summary: 'Get Move Order Lines' })
    @ApiResponse({
        status: 200,
        description: 'Move Order Lines retrieved successfully',
        type: [MoveOrderLineResponseDto],
    })
    async getMoveOrderLines(@Query() queryDto: GetMoveOrderLinesQueryDto): Promise<MoveOrderLineResponseDto[]> {
        const result = await this.moveOrderService.getMoveOrderLines(queryDto);
        return result;
    }

    @Get(':headerId/lines')
    @ApiOperation({ summary: 'Get Move Order Lines by Header ID' })
    @ApiParam({
        name: 'headerId',
        description: 'Header Interface ID',
        type: 'number',
        example: 1001,
    })
    @ApiResponse({
        status: 200,
        description: 'Move Order Lines retrieved successfully',
        type: [MoveOrderLineResponseDto],
    })
    async getMoveOrderLinesByHeaderId(@Param('headerId', ParseIntPipe) headerId: number): Promise<MoveOrderLineResponseDto[]> {
        const result = await this.moveOrderService.getMoveOrderLinesByHeaderId(headerId);
        return result;
    }

    @Get('lines/:lineId')
    @ApiOperation({ summary: 'Get Move Order Line by ID' })
    @ApiParam({
        name: 'lineId',
        description: 'Line Interface ID',
        type: 'number',
        example: 2001,
    })
    @ApiResponse({
        status: 200,
        description: 'Move Order Line retrieved successfully',
        type: MoveOrderLineResponseDto,
    })
    async getMoveOrderLineById(@Param('lineId', ParseIntPipe) lineId: number): Promise<MoveOrderLineResponseDto> {
        const result = await this.moveOrderService.getMoveOrderLineById(lineId);
        return result;
    }

    @Put('lines/:lineId')
    @ApiOperation({ summary: 'Update Move Order Line' })
    @ApiParam({
        name: 'lineId',
        description: 'Line Interface ID',
        type: 'number',
        example: 2001,
    })
    @ApiResponse({
        status: 200,
        description: 'Move Order Line updated successfully',
        type: MoveOrderLineResponseDto,
    })
    async updateMoveOrderLine(
        @Param('lineId', ParseIntPipe) lineId: number,
        @Body() updateDto: UpdateMoveOrderLineDto
    ): Promise<MoveOrderLineResponseDto> {
        const result = await this.moveOrderService.updateMoveOrderLine(lineId, updateDto);
        return result;
    }

    @Delete('lines/:lineId')
    @ApiOperation({ summary: 'Delete Move Order Line' })
    @ApiParam({
        name: 'lineId',
        description: 'Line Interface ID',
        type: 'number',
        example: 2001,
    })
    @ApiResponse({
        status: 200,
        description: 'Move Order Line deleted successfully',
        type: GenericResponseDto,
    })
    async deleteMoveOrderLine(@Param('lineId', ParseIntPipe) lineId: number): Promise<{ success: boolean; message: string }> {
        const result = await this.moveOrderService.deleteMoveOrderLine(lineId);
        return {
            success: result,
            message: result ? 'Move Order Line deleted successfully' : 'Failed to delete Move Order Line'
        };
    }
}
