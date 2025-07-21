import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SalesItemMetaService } from '../services/sales-item.service';
import {
  MetaSalesItemResponseDto,
  MetaSalesItemDtoByDate,
} from '../dtos/sales-item.dtos';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Sales Item Meta')
@Controller('sales-item')
export class SalesItemMetaController {
  private readonly logger = new Logger(SalesItemMetaController.name);

  constructor(private readonly salesItemMetaService: SalesItemMetaService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all sales items',
    description: 'Retrieve all sales items from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'Sales items retrieved successfully',
    type: MetaSalesItemResponseDto,
  })
  async getSalesItems(): Promise<MetaSalesItemResponseDto> {
    this.logger.log('==== REST API: Get all sales items ====');

    try {
      const result =
        await this.salesItemMetaService.getSalesItemsFromOracleByDate();
      this.logger.log(
        `REST API getSalesItems result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving sales items: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving sales items data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @Public()
  @ApiOperation({
    summary: 'Get sales items by date',
    description: 'Retrieve sales items filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter sales items by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Sales items retrieved successfully',
    type: MetaSalesItemResponseDto,
  })
  async getSalesItemsByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<MetaSalesItemResponseDto> {
    this.logger.log('==== REST API: Get sales items by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: MetaSalesItemDtoByDate = {
        last_update_date: lastUpdateDate,
      };
      const result =
        await this.salesItemMetaService.getSalesItemsFromOracleByDate(params);
      this.logger.log(
        `REST API getSalesItemsByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving sales items by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving sales items data: ${error.message}`,
      };
    }
  }
}
