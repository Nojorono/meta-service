import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { MetaWarehouseDto, MetaWarehouseDtoByDate, MetaWarehouseResponseDto, MetaWarehouseDtoByOrganizationCode } from '../dtos/warehouse.dtos';

@Injectable()
export class WarehouseMetaService {
  private readonly logger = new Logger(WarehouseMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getWarehousesFromOracleByDate(
    params?: MetaWarehouseDtoByDate,
  ): Promise<MetaWarehouseResponseDto> {
    const last_update_date = params?.last_update_date;

    const cacheKey = last_update_date
      ? `warehouses:last_update_date:${last_update_date}`
      : 'warehouses:all';

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaWarehouseResponseDto;
      }
      this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
    } catch (error) {
      this.logger.error(
        `Error accessing Redis cache: ${error.message}`,
        error.stack,
      );
    }

    try {
      let query = `
        SELECT * FROM APPS.XTD_INV_WAREHOUSES_V
        WHERE 1=1
      `;

      const queryParams = [];
      if (last_update_date) {
        query += ` AND LAST_UPDATE_DATE >= TO_DATE(:last_update_date, 'YYYY-MM-DD')`;
        queryParams.push(last_update_date);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      const warehouses: MetaWarehouseDto[] = result.rows.map((row) => ({
        subinventory_code: row.SUBINVENTORY_CODE,
        locator_code: row.LOCATOR_CODE,
        locator_id: row.LOCATOR_ID,
        locator_category: row.LOCATOR_CATEGORY,
        warehouse_dms: row.WAREHOUSE_DMS,
        organization_code: row.ORGANIZATION_CODE,
        organization_name: row.ORGANIZATION_NAME,
        organization_id: row.ORGANIZATION_ID,
        org_name: row.ORG_NAME,
        org_id: row.ORG_ID,
        is_active: row.IS_ACTIVE,
        last_update_date: row.LAST_UPDATE_DATE,
      }));

      const response: MetaWarehouseResponseDto = {
        data: warehouses,
        count: warehouses.length,
        status: true,
        message: 'Warehouse data retrieved successfully from Oracle',
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
      }

      return response;
    } catch (error) {
      this.logger.error(
        `Error in getWarehousesFromOracleByDate: ${error.message}`,
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

  async getWarehousesFromOracleByOrganizationCode(
    params?: MetaWarehouseDtoByOrganizationCode,
  ): Promise<MetaWarehouseResponseDto> {
    const organization_code = params?.organization_code;

    const cacheKey = organization_code
      ? `warehouses:organization_code:${organization_code}`
      : 'warehouses:all';

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaWarehouseResponseDto;
      }
      this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
    } catch (error) {
      this.logger.error(
        `Error accessing Redis cache: ${error.message}`,
        error.stack,
      );
    }

    try {
      let query = `
        SELECT * FROM APPS.XTD_INV_WAREHOUSES_V
        WHERE 1=1
      `;

      const queryParams = [];
      if (organization_code) {
        query += ` AND ORGANIZATION_CODE = :organization_code`;
        queryParams.push(organization_code);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      const warehouses: MetaWarehouseDto[] = result.rows.map((row) => ({
        subinventory_code: row.SUBINVENTORY_CODE,
        locator_code: row.LOCATOR_CODE,
        locator_id: row.LOCATOR_ID,
        locator_category: row.LOCATOR_CATEGORY,
        warehouse_dms: row.WAREHOUSE_DMS,
        organization_code: row.ORGANIZATION_CODE,
        organization_name: row.ORGANIZATION_NAME,
        organization_id: row.ORGANIZATION_ID,
        org_name: row.ORG_NAME,
        org_id: row.ORG_ID,
        is_active: row.IS_ACTIVE,
        last_update_date: row.LAST_UPDATE_DATE,
      }));

      const response: MetaWarehouseResponseDto = {
        data: warehouses,
        count: warehouses.length,
        status: true,
        message: 'Warehouse data retrieved successfully from Oracle',
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
      }

      return response;
    } catch (error) {
      this.logger.error(
        `Error in getWarehousesFromOracleByOrganizationCode: ${error.message}`,
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

  async invalidateWarehouseCache(): Promise<void> {
    try {
      const pattern = 'warehouses:*';
      // Implementation depends on your Redis service
      this.logger.log(`Invalidating cache with pattern: ${pattern}`);
    } catch (error) {
      this.logger.error(
        `Error invalidating warehouse cache: ${error.message}`,
        error.stack,
      );
    }
  }
}
