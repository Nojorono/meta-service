import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { MetaRegionDto, MetaRegionDtoByDate } from '../dtos/region.dtos';
import { MetaRegionResponseDto } from '../dtos/region.dtos';

@Injectable()
export class RegionMetaService {
  private readonly logger = new Logger(RegionMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getRegionFromOracleByDate(
    params?: MetaRegionDtoByDate,
  ): Promise<MetaRegionResponseDto> {
    // Set default values if not provided
    const last_update_date = params;

    this.logger.log('params' + params);

    // Generate unique cache key based on parameters
    const cacheKey = last_update_date
      ? `region:last_update_date:${last_update_date}`
      : `region:last_update_date:${last_update_date}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaRegionResponseDto;
      }
      this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
    } catch (error) {
      this.logger.error(
        `Error accessing Redis cache: ${error.message}`,
        error.stack,
      );
      // Continue with database query if cache access fails
    }

    try {
      // Using uppercase for object names since Oracle typically stores them in uppercase
      const query = `
        SELECT * FROM APPS.XTD_INV_REGION_V
        WHERE 1=1
      `;

      const result = await this.oracleService.executeQuery(query);

      // Transform Oracle result to DTO format
      const regions: MetaRegionDto[] = result.rows.map((row) => ({
        region_code: row.REGION_CODE,
        region_name: row.REGION_NAME,
        last_update_date: row.LAST_UPDATE_DATE,
      }));

      // Prepare response
      const response: MetaRegionResponseDto = {
        data: regions,
        count: regions.length,
        status: true,
        message: 'Region data retrieved successfully from Oracle',
      };

      // Store in Redis cache
      try {
        await this.redisService.set(
          cacheKey,
          JSON.stringify(response),
          this.CACHE_TTL,
        );
        this.logger.log(`Data stored in cache with key ${cacheKey}`);
      } catch (cacheError) {
        this.logger.error(
          `Error storing data in Redis: ${cacheError.message}`,
          cacheError.stack,
        );
        // Continue even if cache storage fails
      }

      return response;
    } catch (error) {
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving region data: ${error.message}`,
      };
    }
  }

  async getRegionByIdFromOracle(
    regionCode: string,
  ): Promise<MetaRegionResponseDto> {
    // Generate cache key for customer by ID
    const cacheKey = `region:id:${regionCode}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaRegionResponseDto;
      }
      this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
    } catch (error) {
      this.logger.error(
        `Error accessing Redis cache: ${error.message}`,
        error.stack,
      );
      // Continue with database query if cache access fails
    }

    try {
      const query = `
        SELECT * FROM APPS.XTD_INV_REGION_V
        WHERE REGION_CODE = :regionCode
      `;

      const result = await this.oracleService.executeQuery(query, [regionCode]);

      if (result.rows.length === 0) {
        return {
          data: [],
          count: 0,
          status: false,
          message: `Region with ID ${regionCode} not found`,
        };
      }

      const region: MetaRegionDto = {
        region_code: result.rows[0].REGION_CODE,
        region_name: result.rows[0].REGION_NAME,
        last_update_date: result.rows[0].LAST_UPDATE_DATE,
      };

      const response = {
        data: [region],
        count: 1,
        status: true,
        message: 'Region data retrieved successfully from Oracle',
      };

      // Store in Redis cache
      try {
        await this.redisService.set(
          cacheKey,
          JSON.stringify(response),
          this.CACHE_TTL,
        );
        this.logger.log(`Data stored in cache with key ${cacheKey}`);
      } catch (cacheError) {
        this.logger.error(
          `Error storing data in Redis: ${cacheError.message}`,
          cacheError.stack,
        );
        // Continue even if cache storage fails
      }

      return response;
    } catch (error) {
      this.logger.error(
        `Error in getRegionByIdFromOracle: ${error.message}`,
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

  /**
   * Invalidates region-related caches
   * @param regionCode Optional region code to invalidate specific region cache
   */
  async invalidateRegionCache(regionCode?: string): Promise<void> {
    try {
      if (regionCode) {
        // Invalidate specific region cache
        const cacheKey = `region:id:${regionCode}`;
        await this.redisService.delete(cacheKey);
        this.logger.log(`Invalidated cache for region ID ${regionCode}`);
      }

      // Invalidate all region list cache entries
      await this.redisService.deleteByPattern('region:page:*');
      this.logger.log('Invalidated all region list caches');
    } catch (error) {
      this.logger.error(
        `Error invalidating cache: ${error.message}`,
        error.stack,
      );
    }
  }
}
