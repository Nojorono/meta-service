import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegionMetaService } from '../services/region.service';
import {
  MetaRegionResponseDto,
  MetaRegionDtoByDate,
} from '../dtos/region.dtos';

@Controller()
export class RegionMetaMicroserviceController {
  private readonly logger = new Logger(RegionMetaMicroserviceController.name);

  constructor(private readonly regionMetaService: RegionMetaService) {}

  @MessagePattern('ping')
  ping() {
    this.logger.log('Received ping request region microservice');
    return { status: true, message: 'pong' };
  }

  @MessagePattern('echo')
  echo(@Payload() data: any) {
    this.logger.log(
      'Received echo request with payload region microservice',
      data,
    );
    return { status: true, message: 'echo', data };
  }

  @MessagePattern('get_meta_regions_by_date')
  async getRegionsByDate(
    @Payload() params?: MetaRegionDtoByDate,
  ): Promise<MetaRegionResponseDto> {
    this.logger.log(
      '==== Received request for Oracle regions with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.regionMetaService.getRegionFromOracleByDate(params);
      this.logger.log(
        `Oracle getRegion result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle regions: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error in microservice: ${error.message}`,
      };
    }
  }

  @MessagePattern('get_meta_region_by_id')
  async getRegionById(
    @Payload() data: { regionCode: string },
  ): Promise<MetaRegionResponseDto> {
    this.logger.log(
      `==== Received request for Oracle region with ID: ${data?.regionCode} ====`,
    );

    if (!data || typeof data.regionCode !== 'string') {
      this.logger.error(
        `Invalid region code received: ${JSON.stringify(data)}`,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: 'Invalid region code format',
      };
    }

    try {
      const result = await this.regionMetaService.getRegionByIdFromOracle(
        data.regionCode,
      );
      this.logger.log(
        `Oracle getRegionById result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle region by ID ${data.regionCode}: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error in microservice: ${error.message}`,
      };
    }
  }

  @MessagePattern('invalidate_region_cache')
  async invalidateRegionCache(
    @Payload() data?: { regionCode?: string },
  ): Promise<{ status: boolean; message: string }> {
    try {
      this.logger.log(
        `Received request to invalidate region cache: ${JSON.stringify(data || {})}`,
      );

      await this.regionMetaService.invalidateRegionCache(data?.regionCode);

      return {
        status: true,
        message: data?.regionCode
          ? `Cache invalidated for region code ${data.regionCode}`
          : 'All region caches invalidated',
      };
    } catch (error) {
      this.logger.error(
        `Error invalidating cache: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error invalidating cache: ${error.message}`,
      };
    }
  }
}
