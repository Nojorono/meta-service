import { Controller, Get, Query, Param, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CustomerMetaService } from '../services/customer.service';
import {
  MetaCustomerResponseDto,
  PaginationParamsDto,
  MetaCustomerDtoByDate,
} from '../dtos/customer.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('Customer Meta')
@Controller('customer')
@AuthSwagger()
export class CustomerMetaController {
  private readonly logger = new Logger(CustomerMetaController.name);

  constructor(private readonly customerMetaService: CustomerMetaService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all customers',
    description:
      'Retrieve all customers from Oracle database with optional pagination and search',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term for filtering customers',
  })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: MetaCustomerResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCustomers(
    @Query() params?: PaginationParamsDto,
  ): Promise<MetaCustomerResponseDto> {
    this.logger.log('==== REST API: Get customers with params ====');
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.customerMetaService.getCustomersFromOracle(params);
      this.logger.log(
        `REST API getCustomers result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving customers: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving customer data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get customers by date',
    description: 'Retrieve customers filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter customers by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Customers retrieved successfully',
    type: MetaCustomerResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid date format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCustomersByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<MetaCustomerResponseDto> {
    this.logger.log('==== REST API: Get customers by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: MetaCustomerDtoByDate = {
        last_update_date: lastUpdateDate,
      };
      const result =
        await this.customerMetaService.getCustomersFromOracleByDate(params);
      this.logger.log(
        `REST API getCustomersByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving customers by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving customer data: ${error.message}`,
      };
    }
  }

  @Get(':id')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get customer by ID',
    description: 'Retrieve a specific customer by their account ID',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Customer account ID',
    example: 12345,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
    type: MetaCustomerResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCustomerById(
    @Param('id') customerId: number,
  ): Promise<MetaCustomerResponseDto> {
    this.logger.log(`==== REST API: Get customer by ID: ${customerId} ====`);

    try {
      const result =
        await this.customerMetaService.getCustomerByIdFromOracle(customerId);
      this.logger.log(
        `REST API getCustomerById result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving customer by ID: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving customer data: ${error.message}`,
      };
    }
  }
}
