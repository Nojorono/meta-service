import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WarehouseMetaService } from '../services/warehouse.service';
import {
  MetaWarehouseResponseDto,
  MetaWarehouseDtoByDate,
  MetaWarehouseDtoByOrganizationCode,
} from '../dtos/warehouse.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('Warehouse Meta')
@Controller('warehouse')
export class WarehouseMetaController {
  private readonly logger = new Logger(WarehouseMetaController.name);

  constructor(private readonly warehouseMetaService: WarehouseMetaService) {}

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all warehouses',
    description: 'Retrieve all warehouses from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'Warehouses retrieved successfully',
    type: MetaWarehouseResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getWarehouses(): Promise<MetaWarehouseResponseDto> {
    this.logger.log('==== REST API: Get all warehouses ====');

    try {
      const result =
        await this.warehouseMetaService.getWarehousesFromOracleByDate();
      this.logger.log(
        `REST API getWarehouses result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving warehouses: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving warehouse data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get warehouses by date',
    description: 'Retrieve warehouses filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter warehouses by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Warehouses retrieved successfully',
    type: MetaWarehouseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid date format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getWarehousesByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<MetaWarehouseResponseDto> {
    this.logger.log('==== REST API: Get warehouses by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: MetaWarehouseDtoByDate = {
        last_update_date: lastUpdateDate,
      };
      const result =
        await this.warehouseMetaService.getWarehousesFromOracleByDate(params);
      this.logger.log(
        `REST API getWarehousesByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving warehouses by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving warehouse data: ${error.message}`,
      };
    }
  }

  @Get('organization-code')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get warehouses by organization code',
    description: 'Retrieve warehouses filtered by organization code',
  })
  @ApiQuery({
    name: 'organization_code',
    required: true,
    type: String,
    description: 'Filter warehouses by organization code',
    example: 'SUB',
  })
  @ApiResponse({
    status: 200,
    description: 'Warehouses retrieved successfully',
    type: MetaWarehouseResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid organization format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getWarehousesByOrganizationCode(
    @Query('organization_code') organizationCode: string,
  ): Promise<MetaWarehouseResponseDto> {
    this.logger.log('==== REST API: Get warehouses by date ====');
    this.logger.log(`Organization Code filter: ${organizationCode}`);

    try {
      const params: MetaWarehouseDtoByOrganizationCode = {
        organization_code: organizationCode,
      };
      const result =
        await this.warehouseMetaService.getWarehousesFromOracleByOrganizationCode(
          params,
        );
      this.logger.log(
        `REST API getWarehousesByOrganizationCode result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving warehouses by organization code: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving warehouse data: ${error.message}`,
      };
    }
  }
}
