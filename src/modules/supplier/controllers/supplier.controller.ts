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
import { SupplierService } from '../services/supplier.service';
import { SupplierDto, SupplierQueryDto } from '../dtos/supplier.dtos';

@ApiTags('Supplier')
@Controller('supplier')
@AuthSwagger()
export class SupplierController {
  private readonly logger = new Logger(SupplierController.name);

  constructor(private readonly supplierService: SupplierService) { }

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all suppliers',
    description:
      'Retrieve a list of all suppliers from XTD_AP_SUPPLIERS_V view',
  })
  @ApiQuery({
    name: 'VENDOR_ID',
    required: false,
    description: 'Filter by vendor ID',
    example: 1001,
  })
  @ApiQuery({
    name: 'VENDOR_NAME',
    required: false,
    description: 'Filter by vendor name',
    example: 'Supplier',
  })
  @ApiQuery({
    name: 'VENDOR_TYPE_LOOKUP_CODE',
    required: false,
    description: 'Filter by vendor type lookup code',
    example: 'VENDOR',
  })
  @ApiQuery({
    name: 'ENABLED_FLAG',
    required: false,
    description: 'Filter by enabled flag',
    example: 'Y',
  })
  @ApiQuery({
    name: 'VAT_CODE',
    required: false,
    description: 'Filter by VAT code',
    example: 'VAT01',
  })
  @ApiQuery({
    name: 'ATTRIBUTE7',
    required: false,
    description: 'Filter by attribute 7',
    example: 'FREIGHT (FRG)',
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
    description: 'List of suppliers retrieved successfully',
    type: [SupplierDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllSuppliers(
    @Query() queryDto: SupplierQueryDto,
  ): Promise<SupplierDto[]> {
    try {
      this.logger.log('Fetching all suppliers with filters:', queryDto);
      return await this.supplierService.findAllSuppliers(queryDto);
    } catch (error) {
      this.logger.error('Error fetching suppliers:', error);
      throw new HttpException(
        'Failed to fetch suppliers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get supplier count',
    description:
      'Get the total count of suppliers matching the filter criteria',
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 500 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getSupplierCount(
    @Query() queryDto: SupplierQueryDto,
  ): Promise<{ count: number }> {
    try {
      this.logger.log('Getting supplier count with filters:', queryDto);
      const count = await this.supplierService.getSupplierCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting supplier count:', error);
      throw new HttpException(
        'Failed to get supplier count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('number/:number')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get supplier by number',
    description:
      'Retrieve a specific supplier by its number from XTD_AP_SUPPLIERS_V view',
  })
  @ApiParam({
    name: 'number',
    description: 'Supplier number',
    example: 'SUP001',
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier retrieved successfully',
    type: SupplierDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Supplier not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findSupplierByNumber(
    @Param('number') number: string,
  ): Promise<SupplierDto> {
    try {
      this.logger.log(`Fetching supplier by number: ${number}`);
      const supplier = await this.supplierService.findSupplierByName(number);

      if (!supplier) {
        throw new HttpException(
          `Supplier with number ${number} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return supplier;
    } catch (error) {
      this.logger.error(`Error fetching supplier by number ${number}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch supplier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get supplier by ID',
    description:
      'Retrieve a specific supplier by its ID from XTD_AP_SUPPLIERS_V view',
  })
  @ApiParam({
    name: 'id',
    description: 'Vendor ID',
    example: 1001,
  })
  @ApiResponse({
    status: 200,
    description: 'Supplier retrieved successfully',
    type: SupplierDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Supplier not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findSupplierById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SupplierDto> {
    try {
      this.logger.log(`Fetching supplier by ID: ${id}`);
      const supplier = await this.supplierService.findSupplierById(id);

      if (!supplier) {
        throw new HttpException(
          `Supplier with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return supplier;
    } catch (error) {
      this.logger.error(`Error fetching supplier by ID ${id}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch supplier',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('attribute7/list')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get distinct ATTRIBUTE7 values',
    description:
      'Retrieve a list of all distinct ATTRIBUTE7 values from XTD_AP_SUPPLIERS_V view for dropdown options',
  })
  @ApiResponse({
    status: 200,
    description: 'List of distinct ATTRIBUTE7 values retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        example: 'FREIGHT (FRG)',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDistinctAttribute7(): Promise<string[]> {
    try {
      this.logger.log('Fetching distinct ATTRIBUTE7 values');
      return await this.supplierService.getDistinctAttribute7();
    } catch (error) {
      this.logger.error('Error fetching distinct ATTRIBUTE7:', error);
      throw new HttpException(
        'Failed to fetch distinct ATTRIBUTE7 values',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
