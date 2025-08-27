import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import {
  MetaTruckUtilDto,
  MetaTruckUtilDtoByItem,
  MetaTruckUtilResponseDto,
  TruckUtilQueryDto,
} from './dto/truck-util.dtos';

@Injectable()
export class TruckUtilService {
  private readonly logger = new Logger(TruckUtilService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getTruckUtilFromOracleByItem(
    params?: MetaTruckUtilDtoByItem,
  ): Promise<MetaTruckUtilResponseDto> {
    const ITEM = params?.ITEM;

    const cacheKey = ITEM
      ? `truck_util:item:${ITEM}`
      : 'truck_util:all';

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaTruckUtilResponseDto;
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
        SELECT * FROM 
        (SELECT ITEM, ITEM_DESCRIPTION  
        FROM XTD_INV_UTIL_TRUCK_V
      `;
      const queryParams: any[] = [];

      if (ITEM) {
        query += ` WHERE ITEM = ?`;
        queryParams.push(ITEM);
      }

      query += ` ORDER BY ITEM)`;

      this.logger.log(`Executing query: ${query}`);
      this.logger.log(`Query params: ${JSON.stringify(queryParams)}`);

      const result = await this.oracleService.executeQuery(query, queryParams);

      const truckUtilList: MetaTruckUtilDto[] = result.rows.map((row) => ({
        ITEM: row.ITEM,
        ITEM_DESCRIPTION: row.ITEM_DESCRIPTION,
      }));

      const response: MetaTruckUtilResponseDto = {
        data: truckUtilList,
        count: truckUtilList.length,
        status: true,
        message: 'Truck utility list retrieved successfully',
      };

      // Store in cache
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
        `Error in getTruckUtilFromOracleByItem: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving truck utility data: ${error.message}`,
      };
    }
  }

  async findAllTruckUtils(params: TruckUtilQueryDto): Promise<MetaTruckUtilResponseDto> {
    this.logger.log('==== MICROSERVICE: Find all truck utils ====');
    
    const cacheKey = `truck_util:findAll:page:${params.page || 1}:limit:${params.limit || 10}:search:${params.search || 'all'}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaTruckUtilResponseDto;
      }
    } catch (error) {
      this.logger.error(`Error accessing Redis cache: ${error.message}`);
    }

    try {
      let query = `
        SELECT ITEM, ITEM_DESCRIPTION  
        FROM XTD_INV_UTIL_TRUCK_V
      `;
      const queryParams: any[] = [];

      if (params.search) {
        query += ` WHERE UPPER(ITEM) LIKE UPPER(?) OR UPPER(ITEM_DESCRIPTION) LIKE UPPER(?)`;
        queryParams.push(`%${params.search}%`, `%${params.search}%`);
      }

      query += ` ORDER BY ITEM`;

      if (params.limit) {
        const offset = ((params.page || 1) - 1) * params.limit;
        query += ` OFFSET ${offset} ROWS FETCH NEXT ${params.limit} ROWS ONLY`;
      }

      const result = await this.oracleService.executeQuery(query, queryParams);
      const data = result.rows as MetaTruckUtilDto[];

      const response: MetaTruckUtilResponseDto = {
        data,
        count: data.length,
        status: true,
        message: 'Truck utils retrieved successfully',
      };

      try {
        await this.redisService.set(cacheKey, JSON.stringify(response), this.CACHE_TTL);
      } catch (cacheError) {
        this.logger.error(`Error storing data in Redis: ${cacheError.message}`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Error in findAllTruckUtils: ${error.message}`, error.stack);
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving truck utils: ${error.message}`,
      };
    }
  }

  async countTruckUtils(params: TruckUtilQueryDto): Promise<{ count: number; status: boolean; message?: string }> {
    this.logger.log('==== MICROSERVICE: Count truck utils ====');
    
    const cacheKey = `truck_util:count:search:${params.search || 'all'}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string);
      }
    } catch (error) {
      this.logger.error(`Error accessing Redis cache: ${error.message}`);
    }

    try {
      let query = `SELECT COUNT(*) as count FROM XTD_INV_UTIL_TRUCK_V`;
      const queryParams: any[] = [];

      if (params.search) {
        query += ` WHERE UPPER(ITEM) LIKE UPPER(?) OR UPPER(ITEM_DESCRIPTION) LIKE UPPER(?)`;
        queryParams.push(`%${params.search}%`, `%${params.search}%`);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);
      const count = result.rows[0]?.count || 0;

      const response = {
        count,
        status: true,
        message: 'Truck utils count retrieved successfully',
      };

      try {
        await this.redisService.set(cacheKey, JSON.stringify(response), this.CACHE_TTL);
      } catch (cacheError) {
        this.logger.error(`Error storing count in Redis: ${cacheError.message}`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Error in countTruckUtils: ${error.message}`, error.stack);
      return {
        count: 0,
        status: false,
        message: `Error counting truck utils: ${error.message}`,
      };
    }
  }
}
