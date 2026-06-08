import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SalesmanMetaService } from '../services/salesman.service';
import {
  MetaSalesmanResponseDto,
  MetaSalesmanDtoByDate,
} from '../dtos/salesman.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('Salesman Meta')
@Controller('salesman')
@AuthSwagger()
export class SalesmanMetaController {
  private readonly logger = new Logger(SalesmanMetaController.name);

  constructor(private readonly salesmanMetaService: SalesmanMetaService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all salesmen',
    description: 'Retrieve all salesmen from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'Salesmen retrieved successfully',
    type: MetaSalesmanResponseDto,
  })
  async getSalesmen(): Promise<MetaSalesmanResponseDto> {
    this.logger.log('==== REST API: Get all salesmen ====');

    try {
      const result =
        await this.salesmanMetaService.getSalesmenFromOracleByDate();
      this.logger.log(
        `REST API getSalesmen result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving salesmen: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving salesman data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @ApiOperation({
    summary: 'Get salesmen by date',
    description: 'Retrieve salesmen filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter salesmen by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Salesmen retrieved successfully',
    type: MetaSalesmanResponseDto,
  })
  async getSalesmenByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<MetaSalesmanResponseDto> {
    this.logger.log('==== REST API: Get salesmen by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: MetaSalesmanDtoByDate = {
        last_update_date: lastUpdateDate,
      };
      const result =
        await this.salesmanMetaService.getSalesmenFromOracleByDate(params);
      this.logger.log(
        `REST API getSalesmenByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving salesmen by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving salesman data: ${error.message}`,
      };
    }
  }

  @Get('by-number')
  @ApiOperation({
    summary: 'Get salesman by salesrep number',
    description: 'Retrieve a salesman filtered by SALESREP_NUMBER',
  })
  @ApiQuery({
    name: 'salesrep_number',
    required: true,
    type: String,
    description: 'Sales representative number',
    example: 'SR-001',
  })
  @ApiResponse({
    status: 200,
    description: 'Salesman retrieved successfully',
    type: MetaSalesmanResponseDto,
  })
  async getSalesmanBySalesrepNumber(
    @Query('salesrep_number') salesrepNumber: string,
  ): Promise<MetaSalesmanResponseDto> {
    this.logger.log('==== REST API: Get salesman by salesrep number ====');
    this.logger.log(`Salesrep number filter: ${salesrepNumber}`);

    try {
      const result =
        await this.salesmanMetaService.getSalesmanBySalesrepNumber({
          salesrep_number: salesrepNumber,
        });
      this.logger.log(
        `REST API getSalesmanBySalesrepNumber result: status=${result.status}, count=${result.count}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving salesman by salesrep number: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving salesman data: ${error.message}`,
      };
    }
  }
}
