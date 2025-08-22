import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SalesOrderService } from '../services/salesorder.service';
import {
    CreateSalesOrderHeaderDto,
    SalesOrderHeaderResponseDto,
    CreateSalesOrderLineDto,
    SalesOrderLineResponseDto,
    CreateSalesOrderWithLinesDto,
    SalesOrderWithLinesResponseDto,
    CreateSalesOrderReturnDto
} from '../dtos/salesorder.dtos';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Sales Order Post')
@Controller('salesorder')
@Public()
export class SalesOrderController {
    constructor(private readonly salesOrderService: SalesOrderService) { }

    @Post()
    @ApiOperation({
        summary: 'Create Sales Order Header',
        description: 'Creates a sales order header in XTD_ONT_ORDER_HEADERS_IFACE_V table. Use the returned HEADER_IFACE_ID to create associated lines.'
    })
    @ApiResponse({
        status: 201,
        description: 'Sales Order Header created successfully',
        type: SalesOrderHeaderResponseDto,
    })
    async createSalesOrderHeader(@Body() createDto: CreateSalesOrderHeaderDto): Promise<SalesOrderHeaderResponseDto> {
        const result = await this.salesOrderService.createSalesOrderHeader(createDto);
        return result;
    }

    @Post('lines')
    @ApiOperation({
        summary: 'Create Sales Order Line',
        description: 'Creates a sales order line in XTD_ONT_ORDER_LINES_IFACE_V table. Requires HEADER_IFACE_ID from previously created header.'
    })
    @ApiResponse({
        status: 201,
        description: 'Sales Order Line created successfully',
        type: SalesOrderLineResponseDto,
    })
    async createSalesOrderLine(@Body() createDto: CreateSalesOrderLineDto): Promise<SalesOrderLineResponseDto> {
        const result = await this.salesOrderService.createSalesOrderLine(createDto);
        return result;
    }

    @Post('with-lines')
    @ApiOperation({
        summary: 'Create Sales Order with Lines',
        description: 'Creates a complete sales order with header and lines in a single API call. Header is created first, then all lines are created using the returned HEADER_IFACE_ID.'
    })
    @ApiResponse({
        status: 201,
        description: 'Sales Order with Lines created successfully',
        type: SalesOrderWithLinesResponseDto,
    })
    async createSalesOrderWithLines(@Body() createDto: CreateSalesOrderWithLinesDto): Promise<SalesOrderWithLinesResponseDto> {
        const result = await this.salesOrderService.createSalesOrderWithLines(createDto);
        return result;
    }

    @Post('return')
    @ApiOperation({
        summary: 'Create Sales Order Return',
        description: 'Creates a sales order return with header and lines. Header uses ORDER_CATEGORY_CODE="RETURN" and includes IFACE_OPERATION. Lines use LINE_CATEGORY_CODE="RETURN" and include ATTRIBUTE11 for stock condition (GS/BS).'
    })
    @ApiResponse({
        status: 201,
        description: 'Sales Order Return created successfully',
        type: SalesOrderWithLinesResponseDto,
    })
    async createSalesOrderReturn(@Body() createDto: CreateSalesOrderReturnDto): Promise<SalesOrderWithLinesResponseDto> {
        const result = await this.salesOrderService.createSalesOrderReturn(createDto);
        return result;
    }
}
