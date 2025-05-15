import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { MetaGeoTreeDto, MetaGeoTreeDtoByDate } from '../dtos/geotree.dtos';
import { MetaGeoTreeResponseDto } from '../dtos/geotree.dtos';

@Injectable()
export class GeoTreeMetaService {
  private readonly logger = new Logger(GeoTreeMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getGeoTreeByDate(
    params?: MetaGeoTreeDtoByDate,
  ): Promise<MetaGeoTreeResponseDto> {
    // Set default values if not provided
    const last_update_date = params;

    this.logger.log('params' + params);

    // Generate unique cache key based on parameters
    const cacheKey = last_update_date
      ? `geotree:last_update_date:${last_update_date}`
      : `geotree:last_update_date:${last_update_date}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaGeoTreeResponseDto;
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
        SELECT a.PROVINSI_CODE, a.PROVINSI, b.KOTAMADYA_CODE, b.KOTAMADYA, c.KECAMATAN_CODE, 
c.KECAMATAN, d.KELURAHAN_CODE, d.KELURAHAN, GREATEST(
a.LAST_UPDATE_DATE,
b.LAST_UPDATE_DATE,
c.LAST_UPDATE_DATE,
d.LAST_UPDATE_DATE
) LAST_UPDATE_DATE
FROM XTD_FND_PROVINSI_V a
LEFT JOIN XTD_FND_KOTAMADYA_V b ON b.PROVINSI_CODE = a.PROVINSI_CODE AND b.KOTAMADYA_ENABLED_FLAG = 'Y'
LEFT JOIN XTD_FND_KECAMATAN_V c ON c.KOTAMADYA_CODE = b.KOTAMADYA_CODE AND c.KECAMATAN_ENABLED_FLAG = 'Y'
LEFT JOIN XTD_FND_KELURAHAN_V d ON d.KECAMATAN_CODE = c.KECAMATAN_CODE AND d.KELURAHAN_ENABLED_FLAG ='Y'
WHERE a.PROVINSI_ENABLED_FLAG ='Y'
      `;

      const result = await this.oracleService.executeQuery(query);

      // Transform Oracle result to DTO format
      const geotree: MetaGeoTreeDto[] = result.rows.map((row) => ({
        kecamatan: row.KECAMATAN,
        kecamatan_code: row.KECAMATAN_CODE,
        kelurahan: row.KELURAHAN,
        kelurahan_code: row.KELURAHAN_CODE,
        kotamadya: row.KOTAMADYA,
        kotamadya_code: row.KOTAMADYA_CODE,
        provinsi: row.PROVINSI,
        provinsi_code: row.PROVINSI_CODE,
        last_update_date: row.LAST_UPDATE_DATE,
      }));

      // Prepare response
      const response: MetaGeoTreeResponseDto = {
        data: geotree,
        count: geotree.length,
        status: true,
        message: 'Geotree data retrieved successfully from Oracle',
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

  async getGeoTreeByIdFromOracle(
    regionCode: string,
  ): Promise<MetaGeoTreeResponseDto> {
    // Generate cache key for customer by ID
    const cacheKey = `geotree:id:${regionCode}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaGeoTreeResponseDto;
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
        SELECT a.PROVINSI_CODE, a.PROVINSI, b.KOTAMADYA_CODE, b.KOTAMADYA, c.KECAMATAN_CODE, 
c.KECAMATAN, d.KELURAHAN_CODE, d.KELURAHAN, GREATEST(
a.LAST_UPDATE_DATE,
b.LAST_UPDATE_DATE,
c.LAST_UPDATE_DATE,
d.LAST_UPDATE_DATE
) LAST_UPDATE_DATE
FROM XTD_FND_PROVINSI_V a
LEFT JOIN XTD_FND_KOTAMADYA_V b ON b.PROVINSI_CODE = a.PROVINSI_CODE AND b.KOTAMADYA_ENABLED_FLAG = 'Y'
LEFT JOIN XTD_FND_KECAMATAN_V c ON c.KOTAMADYA_CODE = b.KOTAMADYA_CODE AND c.KECAMATAN_ENABLED_FLAG = 'Y'
LEFT JOIN XTD_FND_KELURAHAN_V d ON d.KECAMATAN_CODE = c.KECAMATAN_CODE AND d.KELURAHAN_ENABLED_FLAG ='Y'
WHERE a.PROVINSI_ENABLED_FLAG ='Y'
      `;

      const result = await this.oracleService.executeQuery(query, [regionCode]);

      if (result.rows.length === 0) {
        return {
          data: [],
          count: 0,
          status: false,
          message: `Geotree with ID ${regionCode} not found`,
        };
      }

      const geotree: MetaGeoTreeDto = {
        kecamatan: result.rows[0].KECAMATAN,
        kecamatan_code: result.rows[0].KECAMATAN_CODE,
        kelurahan: result.rows[0].KELURAHAN,
        kelurahan_code: result.rows[0].KELURAHAN_CODE,
        kotamadya: result.rows[0].KOTAMADYA,
        kotamadya_code: result.rows[0].KOTAMADYA_CODE,
        provinsi: result.rows[0].PROVINSI,
        provinsi_code: result.rows[0].PROVINSI_CODE,
        last_update_date: result.rows[0].LAST_UPDATE_DATE,
      };

      const response = {
        data: [geotree],
        count: 1,
        status: true,
        message: 'Geotree data retrieved successfully from Oracle',
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
        message: `Error retrieving geotree data: ${error.message}`,
      };
    }
  }

  /**
   * Invalidates region-related caches
   * @param regionCode Optional region code to invalidate specific region cache
   */
  async invalidateGeoTreeCache(regionCode?: string): Promise<void> {
    try {
      if (regionCode) {
        // Invalidate specific region cache
        const cacheKey = `geotree:id:${regionCode}`;
        await this.redisService.delete(cacheKey);
        this.logger.log(`Invalidated cache for region ID ${regionCode}`);
      }

      // Invalidate all region list cache entries
      await this.redisService.deleteByPattern('geotree:page:*');
      this.logger.log('Invalidated all region list caches');
    } catch (error) {
      this.logger.error(
        `Error invalidating cache: ${error.message}`,
        error.stack,
      );
    }
  }
}
