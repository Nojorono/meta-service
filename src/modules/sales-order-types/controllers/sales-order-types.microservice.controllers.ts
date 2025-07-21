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
import { SalesOrderTypesService } from '../services/sales-order-types.service';
import {
  SalesOrderTypesDto,
  SalesOrderTypesQueryDto,
} from '../dtos/sales-order-types.dtos';

@ApiTags('Sales Order Types')
@Controller('sales-order-types')
export class SalesOrderTypesMicroserviceController {
  constructor(
    private readonly salesOrderTypesService: SalesOrderTypesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all sales order types' })
  @ApiResponse({
    status: 200,
    description: 'Sales order types retrieved successfully',
    type: [SalesOrderTypesDto],
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
    name: 'TRANSACTION_TYPE_ID',
    required: false,
    type: Number,
    description: 'Transaction type ID',
  })
  @ApiQuery({
    name: 'TRANSACTION_TYPE_NAME',
    required: false,
    type: String,
    description: 'Transaction type name',
  })
  @ApiQuery({
    name: 'ORDER_CATEGORY_CODE',
    required: false,
    type: String,
    description: 'Order category code',
  })
  async findAll(@Query() query: SalesOrderTypesQueryDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page = 1, limit = 10, ..._filters } = query;

      const [data, total] = await Promise.all([
        this.salesOrderTypesService.findAllSalesOrderTypes(query),
        this.salesOrderTypesService.countSalesOrderTypes(query),
      ]);

      return {
        success: true,
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve sales order types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get sales order type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sales order type retrieved successfully',
    type: SalesOrderTypesDto,
  })
  @ApiResponse({ status: 404, description: 'Sales order type not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result =
        await this.salesOrderTypesService.findSalesOrderTypeById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Sales order type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('sales_order_types.findAll')
  async findAllMicroservice(@Payload() query: SalesOrderTypesQueryDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page = 1, limit = 10, ..._filters } = query;

      const [data, total] = await Promise.all([
        this.salesOrderTypesService.findAllSalesOrderTypes(query),
        this.salesOrderTypesService.countSalesOrderTypes(query),
      ]);

      return {
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve sales order types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('sales_order_types.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.salesOrderTypesService.findSalesOrderTypeById(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Sales order type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
