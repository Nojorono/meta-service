import { Injectable, Logger } from '@nestjs/common';
import {
  MetaBranchDto,
  MetaBranchDtoByDate,
  MetaBranchResponseDto,
} from '../dtos/branch.dtos';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';

@Injectable()
export class BranchMetaService {
  private readonly logger = new Logger(BranchMetaService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getBranchesFromOracleByDate(
    params?: MetaBranchDtoByDate,
  ): Promise<MetaBranchResponseDto> {
    // Set default values if not provided
    const last_update_date = params;

    this.logger.log('params.last_update_date' + last_update_date);
    // Generate unique cache key based on parameters
    const cacheKey = last_update_date
      ? `branches:last_update_date:${last_update_date}`
      : `branches:last_update_date:${last_update_date}`;

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaBranchResponseDto;
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
      let query = `
        SELECT * FROM APPS.XTD_INV_BRANCHES_V
        WHERE 1=1
      `;

      // Add search condition if search term is provided
      const queryParams = [];
      if (last_update_date) {
        query += ` AND LAST_UPDATE_DATE >= TO_DATE(:last_update_date, 'YYYY-MM-DD') AND LAST_UPDATE_DATE < TO_DATE(:last_update_date, 'YYYY-MM-DD') + 1`;
        queryParams.push(last_update_date, last_update_date);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);

      // Transform Oracle result to DTO format
      const branches: MetaBranchDto[] = result.rows.map((row) => ({
        organization_code: row.ORGANIZATION_CODE,
        organization_name: row.ORGANIZATION_NAME,
        organization_id: row.ORGANIZATION_ID,
        org_name: row.ORG_NAME,
        org_id: row.ORG_ID,
        organization_type: row.ORGANIZATION_TYPE,
        region_code: row.REGION_CODE,
        address: row.ADDRESS,
        location_id: row.LOCATION_ID,
        start_date_active: row.START_DATE_ACTIVE,
        end_date_active: row.END_DATE_ACTIVE,
      }));

      // Prepare response
      const response: MetaBranchResponseDto = {
        data: branches,
        count: branches.length,
        status: true,
        message: 'Branch data retrieved successfully from Oracle',
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
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving branch data: ${error.message}`,
      };
    }
  }
}
