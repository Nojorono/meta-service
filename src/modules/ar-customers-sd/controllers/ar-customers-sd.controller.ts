import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';
import { ArCustomersSdService } from '../services/ar-customers-sd.service';
import {
  ArCustomersSdDto,
  ArCustomersSdQueryDto,
} from '../dtos/ar-customers-sd.dtos';

@ApiTags('AR Customers SD')
@Controller('ar-customers-sd')
@AuthSwagger()
export class ArCustomersSdController {
  private readonly logger = new Logger(ArCustomersSdController.name);

  constructor(
    private readonly arCustomersSdService: ArCustomersSdService,
  ) {}

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all AR customers',
    description:
      'Retrieve a list of all AR customers from XTD_AR_CUSTOMERS_SD_V view',
  })
  @ApiQuery({
    name: 'customerNumber',
    required: false,
    description: 'Filter by customer number',
    example: 'CUST-001',
  })
  @ApiQuery({
    name: 'customerName',
    required: false,
    description: 'Filter by customer name',
    example: 'PT ABC',
  })
  @ApiQuery({
    name: 'custAccountId',
    required: false,
    description: 'Filter by customer account ID',
    example: 5001,
  })
  @ApiQuery({
    name: 'orgId',
    required: false,
    description: 'Filter by organization ID',
    example: 201,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    example: 'A',
  })
  @ApiQuery({
    name: 'channel',
    required: false,
    description: 'Filter by channel',
    example: 'RETAIL',
  })
  @ApiQuery({
    name: 'provinsi',
    required: false,
    description: 'Filter by provinsi',
    example: 'DKI Jakarta',
  })
  @ApiQuery({
    name: 'kabKodya',
    required: false,
    description: 'Filter by Kab/Kodya',
    example: 'Jakarta Selatan',
  })
  @ApiQuery({
    name: 'kecamatan',
    required: false,
    description: 'Filter by kecamatan',
    example: 'Kebayoran Baru',
  })
  @ApiQuery({
    name: 'siteType',
    required: false,
    description: 'Filter by site type',
    example: 'BILL_TO',
  })
  @ApiQuery({
    name: 'priceListId',
    required: false,
    description: 'Filter by price list ID',
    example: 301,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of customers retrieved successfully',
    type: [ArCustomersSdDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllCustomers(
    @Query() queryDto: ArCustomersSdQueryDto,
  ): Promise<ArCustomersSdDto[]> {
    try {
      this.logger.log('Fetching all customers with filters:', queryDto);
      return await this.arCustomersSdService.findAllCustomers(queryDto);
    } catch (error) {
      this.logger.error('Error fetching customers:', error);
      throw new HttpException(
        'Failed to fetch customers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get customers count',
    description:
      'Get the total count of customers matching the filter criteria',
  })
  @ApiQuery({
    name: 'customerNumber',
    required: false,
    description: 'Filter by customer number',
    example: 'CUST-001',
  })
  @ApiQuery({
    name: 'customerName',
    required: false,
    description: 'Filter by customer name',
    example: 'PT ABC',
  })
  @ApiQuery({
    name: 'custAccountId',
    required: false,
    description: 'Filter by customer account ID',
    example: 5001,
  })
  @ApiQuery({
    name: 'orgId',
    required: false,
    description: 'Filter by organization ID',
    example: 201,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
    example: 'A',
  })
  @ApiQuery({
    name: 'channel',
    required: false,
    description: 'Filter by channel',
    example: 'RETAIL',
  })
  @ApiQuery({
    name: 'provinsi',
    required: false,
    description: 'Filter by provinsi',
    example: 'DKI Jakarta',
  })
  @ApiQuery({
    name: 'kabKodya',
    required: false,
    description: 'Filter by Kab/Kodya',
    example: 'Jakarta Selatan',
  })
  @ApiQuery({
    name: 'kecamatan',
    required: false,
    description: 'Filter by kecamatan',
    example: 'Kebayoran Baru',
  })
  @ApiQuery({
    name: 'siteType',
    required: false,
    description: 'Filter by site type',
    example: 'BILL_TO',
  })
  @ApiQuery({
    name: 'priceListId',
    required: false,
    description: 'Filter by price list ID',
    example: 301,
  })
  @ApiResponse({
    status: 200,
    description: 'Customers count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 150 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCustomersCount(
    @Query() queryDto: ArCustomersSdQueryDto,
  ): Promise<{ count: number }> {
    try {
      this.logger.log('Getting customers count with filters:', queryDto);
      const count =
        await this.arCustomersSdService.getCustomersCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting customers count:', error);
      throw new HttpException(
        'Failed to get customers count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('number/:number')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get customer by number',
    description:
      'Retrieve customer(s) by customer number from XTD_AR_CUSTOMERS_SD_V view',
  })
  @ApiParam({
    name: 'number',
    description: 'Customer number',
    example: 'CUST-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer(s) retrieved successfully',
    type: [ArCustomersSdDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findCustomerByNumber(
    @Param('number') number: string,
  ): Promise<ArCustomersSdDto[]> {
    try {
      this.logger.log(`Fetching customer by number: ${number}`);
      const customers =
        await this.arCustomersSdService.findCustomerByNumber(number);

      if (customers.length === 0) {
        throw new HttpException(
          `Customer with number ${number} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return customers;
    } catch (error) {
      this.logger.error(
        `Error fetching customer by number ${number}:`,
        error,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get customer by ID',
    description:
      'Retrieve a specific customer by CUST_ACCOUNT_ID from XTD_AR_CUSTOMERS_SD_V view',
  })
  @ApiParam({
    name: 'id',
    description: 'Customer Account ID',
    example: 5001,
  })
  @ApiResponse({
    status: 200,
    description: 'Customer retrieved successfully',
    type: ArCustomersSdDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Customer not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findCustomerById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArCustomersSdDto> {
    try {
      this.logger.log(`Fetching customer by ID: ${id}`);
      const customer = await this.arCustomersSdService.findCustomerById(id);

      if (!customer) {
        throw new HttpException(
          `Customer with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return customer;
    } catch (error) {
      this.logger.error(`Error fetching customer by ID ${id}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch customer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

