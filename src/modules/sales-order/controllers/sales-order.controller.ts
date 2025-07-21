import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SalesOrderService } from '../services/sales-order.service';
import { SalesOrderDto, SalesOrderQueryDto } from '../dtos/sales-order.dtos';

@ApiTags('Sales Order')
@Controller('sales-order')
export class SalesOrderController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sales orders or filter by order_number' })
  @ApiResponse({
    status: 200,
    description: 'Sales orders retrieved successfully',
    type: [SalesOrderDto],
  })
  @ApiQuery({
    name: 'order_number',
    required: false,
    type: String,
    description: 'Order number',
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
  async findAll(@Query() query: SalesOrderQueryDto) {
    try {
      const result = await this.salesOrderService.findAll(query);
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
          message: 'Failed to retrieve sales orders',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
