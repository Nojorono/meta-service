import { Controller, Get, Query, Param, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { RegionMetaService } from '../services/region.service';
import {
  MetaRegionResponseDto,
  MetaRegionDtoByDate,
} from '../dtos/region.dtos';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Region Meta')
@Controller('region')
export class RegionMetaController {
  private readonly logger = new Logger(RegionMetaController.name);

  constructor(private readonly regionMetaService: RegionMetaService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all regions',
    description: 'Retrieve all regions from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'Regions retrieved successfully',
    type: MetaRegionResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getRegions(): Promise<MetaRegionResponseDto> {
    this.logger.log('==== REST API: Get all regions ====');

    try {
      const result = await this.regionMetaService.getRegionFromOracleByDate();
      this.logger.log(
        `REST API getRegions result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving regions: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving region data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @Public()
  @ApiOperation({
    summary: 'Get regions by date',
    description: 'Retrieve regions filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter regions by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Regions retrieved successfully',
    type: MetaRegionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid date format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getRegionsByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<MetaRegionResponseDto> {
    this.logger.log('==== REST API: Get regions by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: MetaRegionDtoByDate = { last_update_date: lastUpdateDate };
      const result =
        await this.regionMetaService.getRegionFromOracleByDate(params);
      this.logger.log(
        `REST API getRegionsByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving regions by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving region data: ${error.message}`,
      };
    }
  }

  @Get(':code')
  @Public()
  @ApiOperation({
    summary: 'Get region by code',
    description: 'Retrieve a specific region by its code',
  })
  @ApiParam({
    name: 'code',
    type: String,
    description: 'Region code',
    example: 'REG001',
  })
  @ApiResponse({
    status: 200,
    description: 'Region retrieved successfully',
    type: MetaRegionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Region not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getRegionByCode(
    @Param('code') regionCode: string,
  ): Promise<MetaRegionResponseDto> {
    this.logger.log(`==== REST API: Get region by code: ${regionCode} ====`);

    try {
      const result =
        await this.regionMetaService.getRegionByIdFromOracle(regionCode);
      this.logger.log(
        `REST API getRegionByCode result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving region by code: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving region data: ${error.message}`,
      };
    }
  }
}
