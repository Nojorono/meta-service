import { Body, Controller, Get, Post, Query, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { MoveOrderService } from '../services/move-order.service';
import {
    CreateMoveOrderDto,
    MoveOrderResponseDto,
    GetMoveOrdersQueryDto,
    CreateMoveOrderLineDto,
    MoveOrderLineResponseDto,
    GetMoveOrderLinesQueryDto,
    CreateMoveOrderWithLinesDto,
    MoveOrderWithLinesResponseDto,
    MoveOrderFindWithLinesResponseDto,
} from '../dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Move Orders')
@Controller('move-orders')
@Public()
export class MoveOrderController {
    constructor(private readonly moveOrderService: MoveOrderService) { }

    // @Post()
    // @ApiOperation({ summary: 'Create Move Order' })
    // @ApiResponse({
    //     status: 201,
    //     description: 'Move Order created successfully',
    //     type: MoveOrderResponseDto,
    // })
    // async createMoveOrder(@Body() createDto: CreateMoveOrderDto): Promise<MoveOrderResponseDto> {
    //     const result = await this.moveOrderService.createMoveOrder(createDto);
    //     return result;
    // }

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

    @Get('by-request-number')
    @ApiOperation({
        summary: 'Find move order with lines by request number',
        description:
            'Returns the latest move order header and all associated lines for the given REQUEST_NUMBER',
    })
    @ApiQuery({
        name: 'request_number',
        required: true,
        type: String,
        example: 'JAT/SPB/2024/01/000002',
    })
    @ApiQuery({
        name: 'source_system',
        required: false,
        type: String,
        example: 'WMS',
    })
    @ApiResponse({
        status: 200,
        description: 'Move order with lines retrieved successfully',
        type: MoveOrderFindWithLinesResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Bad request - request_number is required' })
    @ApiResponse({ status: 404, description: 'Move order not found' })
    async findMoveOrderWithLinesByRequestNumber(
        @Query('request_number') requestNumber: string,
        @Query('source_system') sourceSystem?: string,
    ): Promise<NonNullable<MoveOrderFindWithLinesResponseDto['data']>> {
        const result =
            await this.moveOrderService.findMoveOrderWithLinesByRequestNumber(
                requestNumber,
                sourceSystem,
            );

        if (!result.status) {
            if (result.message === 'request_number is required') {
                throw new BadRequestException(result.message);
            }
            if (result.message.startsWith('No move order found')) {
                throw new NotFoundException(result.message);
            }
            throw new InternalServerErrorException(result.message);
        }

        return result.data!;
    }

    // @Post('lines')
    // @ApiOperation({ summary: 'Create Move Order Line' })
    // @ApiResponse({
    //     status: 201,
    //     description: 'Move Order Line created successfully',
    //     type: MoveOrderLineResponseDto,
    // })
    // async createMoveOrderLine(@Body() createDto: CreateMoveOrderLineDto): Promise<MoveOrderLineResponseDto> {
    //     const result = await this.moveOrderService.createMoveOrderLine(createDto);
    //     return result;
    // }
}
