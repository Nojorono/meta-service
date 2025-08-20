import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { SalesOrderStockService } from '../services/sales-order-stock.service';
import {
  SalesOrderStockDto,
  SalesOrderStockQueryDto,
} from '../dtos/sales-order-stock.dtos';

@ApiTags('Sales Order Stock')
@AuthSwagger()
@Controller('sales-order-stock')
export class SalesOrderStockController {
  private readonly logger = new Logger(SalesOrderStockController.name);

  constructor(
    private readonly salesOrderStockService: SalesOrderStockService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all sales order stock' })
  @ApiResponse({
    status: 200,
    description: 'Sales order stock retrieved successfully',
    type: [SalesOrderStockDto],
  })
  @ApiQuery({
    name: 'ORGANIZATION_CODE',
    required: false,
    description: 'Filter by organization code',
  })
  @ApiQuery({
    name: 'ITEM_CODE',
    required: false,
    description: 'Filter by item code',
  })
  @ApiQuery({
    name: 'ITEM_DESCRIPTION',
    required: false,
    description: 'Filter by item description',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: SalesOrderStockQueryDto): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const [data, total] = await Promise.all([
      this.salesOrderStockService.findAllSalesOrderStock(query),
      this.salesOrderStockService.countSalesOrderStock(query),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Sales order stock retrieved successfully',
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sales order stock by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sales order stock retrieved successfully',
    type: SalesOrderStockDto,
  })
  @ApiResponse({ status: 404, description: 'Sales order stock not found' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result =
        await this.salesOrderStockService.findSalesOrderStockById(id);

      if (!result) {
        return {
          success: false,
          statusCode: 404,
          message: 'Sales order stock not found',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Sales order stock retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error fetching sales order stock:', error);
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve sales order stock',
        data: null,
      };
    }
  }
}
