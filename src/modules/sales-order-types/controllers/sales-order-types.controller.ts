import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { SalesOrderTypesService } from '../services/sales-order-types.service';
import {
  SalesOrderTypesDto,
  SalesOrderTypesQueryDto,
} from '../dtos/sales-order-types.dtos';

@ApiTags('Sales Order Types')
@AuthSwagger()
@Controller('sales-order-types')
export class SalesOrderTypesController {
  private readonly logger = new Logger(SalesOrderTypesController.name);

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
    name: 'ORDER_CATEGORY_CODE',
    required: false,
    description: 'Filter by order category code',
  })
  @ApiQuery({
    name: 'TRANSACTION_TYPE_NAME',
    required: false,
    description: 'Filter by transaction type name',
  })
  @ApiQuery({
    name: 'TRANSACTION_TYPE_ID',
    required: false,
    description: 'Filter by transaction type ID',
  })
  @ApiQuery({
    name: 'ORGANIZATION_CODE',
    required: false,
    description: 'Filter by organization code',
  })
  @ApiQuery({
    name: 'TRANSACTION_TYPE_DMS',
    required: false,
    description: 'Filter by transaction type DMS',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: SalesOrderTypesQueryDto): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const [data, total] = await Promise.all([
      this.salesOrderTypesService.findAllSalesOrderTypes(query),
      this.salesOrderTypesService.countSalesOrderTypes(query),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Sales order types retrieved successfully',
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
  @ApiOperation({ summary: 'Get a sales order type by ID' })
  @ApiResponse({
    status: 200,
    description: 'Sales order type retrieved successfully',
    type: SalesOrderTypesDto,
  })
  @ApiResponse({ status: 404, description: 'Sales order type not found' })
  @ApiParam({
    name: 'id',
    description: 'Transaction Type ID',
    example: '1001',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result =
        await this.salesOrderTypesService.findSalesOrderTypeById(id);

      if (!result) {
        return {
          success: false,
          statusCode: 404,
          message: 'Sales order type not found',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Sales order type retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error fetching sales order type:', error);
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve sales order type',
        data: null,
      };
    }
  }
}
