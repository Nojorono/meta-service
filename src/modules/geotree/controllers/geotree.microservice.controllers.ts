import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GeoTreeMetaService } from '../services/geotree.service';
import {
  MetaGeoTreeResponseDto,
  MetaGeoTreeDtoByDate,
} from '../dtos/geotree.dtos';

@Controller()
export class GeoTreeMetaMicroserviceController {
  private readonly logger = new Logger(GeoTreeMetaMicroserviceController.name);

  constructor(private readonly geoTreeMetaService: GeoTreeMetaService) {}

  @MessagePattern('ping_geotree')
  ping() {
    return { status: true, message: 'connected to geotree microservice' };
  }

  @MessagePattern('echo_geotree')
  echo(@Payload() data: any) {
    this.logger.log(
      'Received echo request with payload geotree microservice',
      data,
    );
    return { status: true, message: 'echo', data };
  }

  @MessagePattern('get_meta_geotree_by_date')
  async getGeoTreeByDate(
    @Payload() params?: MetaGeoTreeDtoByDate,
  ): Promise<MetaGeoTreeResponseDto> {
    this.logger.log(
      '==== Received request for Oracle geotree with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result = await this.geoTreeMetaService.getGeoTreeByDate(params);
      this.logger.log(
        `Oracle get geotree result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle geotree: ${error.message}`,
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

  @MessagePattern('get_meta_geotree_by_id')
  async getGeoTreeById(
    @Payload() data: { regionCode: string },
  ): Promise<MetaGeoTreeResponseDto> {
    this.logger.log(
      `==== Received request for Oracle geotree with ID: ${data?.regionCode} ====`,
    );

    if (!data || typeof data.regionCode !== 'string') {
      this.logger.error(
        `Invalid geotree code received: ${JSON.stringify(data)}`,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: 'Invalid geotree code format',
      };
    }

    try {
      const result = await this.geoTreeMetaService.getGeoTreeByIdFromOracle(
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

  @MessagePattern('invalidate_geotree_cache')
  async invalidateGeoTreeCache(
    @Payload() data?: { regionCode?: string },
  ): Promise<{ status: boolean; message: string }> {
    try {
      this.logger.log(
        `Received request to invalidate   geotree cache: ${JSON.stringify(data || {})}`,
      );

      await this.geoTreeMetaService.invalidateGeoTreeCache(data?.regionCode);

      return {
        status: true,
        message: data?.regionCode
          ? `Cache invalidated for geotree code ${data.regionCode}`
          : 'All geotree caches invalidated',
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
