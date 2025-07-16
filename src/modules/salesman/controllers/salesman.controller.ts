import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SalesmanMetaService } from '../services/salesman.service';
import {
  MetaSalesmanResponseDto,
  MetaSalesmanDtoByDate,
} from '../dtos/salesman.dtos';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Salesman Meta')
@Controller('salesman')
export class SalesmanMetaController {
  private readonly logger = new Logger(SalesmanMetaController.name);

  constructor(private readonly salesmanMetaService: SalesmanMetaService) {}

  @Get()
  @Public()
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
      const result = await this.salesmanMetaService.getSalesmenFromOracleByDate();
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
  @Public()
  @ApiOperation({
    summary: 'Get salesmen by date',
    description: 'Retrieve salesmen filtered by last update date',
  })
  @ApiQuery({ 
    name: 'last_update_date', 
    required: true, 
    type: String, 
    description: 'Filter salesmen by last update date (YYYY-MM-DD format)',
    example: '2024-01-15'
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
      const params: MetaSalesmanDtoByDate = { last_update_date: lastUpdateDate };
      const result = await this.salesmanMetaService.getSalesmenFromOracleByDate(params);
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
}
