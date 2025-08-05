import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GeoTreeMetaService } from '../services/geotree.service';
import {
  MetaGeoTreeResponseDto,
  MetaGeoTreeDtoByDate,
} from '../dtos/geotree.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('GeoTree Meta')
@Controller('geotree')
export class GeoTreeMetaController {
  private readonly logger = new Logger(GeoTreeMetaController.name);

  constructor(private readonly geoTreeMetaService: GeoTreeMetaService) {}

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all geo trees',
    description: 'Retrieve all geographic tree data from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'GeoTree data retrieved successfully',
    type: MetaGeoTreeResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getGeoTrees(): Promise<MetaGeoTreeResponseDto> {
    this.logger.log('==== REST API: Get all geo trees ====');

    try {
      const result = await this.geoTreeMetaService.getGeoTreeByDate();
      this.logger.log(
        `REST API getGeoTrees result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving geo trees: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving geo tree data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get geo trees by date',
    description: 'Retrieve geographic tree data filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter geo trees by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'GeoTree data retrieved successfully',
    type: MetaGeoTreeResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid date format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getGeoTreesByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<MetaGeoTreeResponseDto> {
    this.logger.log('==== REST API: Get geo trees by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: MetaGeoTreeDtoByDate = { last_update_date: lastUpdateDate };
      const result = await this.geoTreeMetaService.getGeoTreeByDate(params);
      this.logger.log(
        `REST API getGeoTreesByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving geo trees by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving geo tree data: ${error.message}`,
      };
    }
  }
}
