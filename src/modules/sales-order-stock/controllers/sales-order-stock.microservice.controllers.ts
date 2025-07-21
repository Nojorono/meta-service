import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SalesOrderStockService } from '../services/sales-order-stock.service';
import {
  SalesOrderStockDto,
  SalesOrderStockQueryDto,
} from '../dtos/sales-order-stock.dtos';

@ApiTags('Sales Order Stock')
@Controller('sales-order-stock')
export class SalesOrderStockMicroserviceController {
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
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'HEADER_ID',
    required: false,
    type: Number,
    description: 'Header ID',
  })
  @ApiQuery({
    name: 'ORDER_NUMBER',
    required: false,
    type: String,
    description: 'Order number',
  })
  @ApiQuery({
    name: 'INVENTORY_ITEM_ID',
    required: false,
    type: Number,
    description: 'Inventory item ID',
  })
  @ApiQuery({
    name: 'ITEM_CODE',
    required: false,
    type: String,
    description: 'Item code',
  })
  @ApiQuery({
    name: 'CUSTOMER_ID',
    required: false,
    type: Number,
    description: 'Customer ID',
  })
  @ApiQuery({
    name: 'CUSTOMER_NUMBER',
    required: false,
    type: String,
    description: 'Customer number',
  })
  @ApiQuery({
    name: 'FLOW_STATUS_CODE',
    required: false,
    type: String,
    description: 'Flow status code',
  })
  @ApiQuery({
    name: 'OPEN_FLAG',
    required: false,
    type: String,
    description: 'Open flag',
  })
  async findAll(@Query() query: SalesOrderStockQueryDto) {
    try {
      const result = await this.salesOrderStockService.findAll(query);
      return {
        success: true,
        data: result.data,
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve sales order stock',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sales order stock by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sales order stock retrieved successfully',
    type: SalesOrderStockDto,
  })
  @ApiResponse({ status: 404, description: 'Sales order stock not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.salesOrderStockService.findOne(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Sales order stock not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('sales_order_stock.findAll')
  async findAllMicroservice(@Payload() query: SalesOrderStockQueryDto) {
    try {
      return await this.salesOrderStockService.findAll(query);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve sales order stock',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('sales_order_stock.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.salesOrderStockService.findOne(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Sales order stock not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
