import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import {
  MetaUomListDto,
  MetaUomListDtoByUomCode,
  MetaUomListResponseDto,
  UomListQueryDto,
} from './dto/uom-list.dtos';

@Injectable()
export class UomListService {
  private readonly logger = new Logger(UomListService.name);
  private readonly CACHE_TTL = 60 * 60; // Cache for 1 hour

  constructor(
    private readonly configService: ConfigService,
    private readonly oracleService: OracleService,
    private readonly redisService: RedisService,
  ) {}

  async getUomListFromOracleByUomCode(
    params?: MetaUomListDtoByUomCode,
  ): Promise<MetaUomListResponseDto> {
    const UOM_CODE = params?.UOM_CODE;

    const cacheKey = UOM_CODE
      ? `uom_list:uom_code:${UOM_CODE}`
      : 'uom_list:all';

    // Try to get data from cache first
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaUomListResponseDto;
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
        (SELECT UNIT_OF_MEASURE, UOM_CODE  
        FROM XTD_INV_ITEM_UOM_ROKOK_V
      `;
      const queryParams: any[] = [];

      if (UOM_CODE) {
        query += ` WHERE UOM_CODE = ?`;
        queryParams.push(UOM_CODE);
      }

      query += ` ORDER BY UOM_CODE)`;

      this.logger.log(`Executing query: ${query}`);
      this.logger.log(`Query params: ${JSON.stringify(queryParams)}`);

      const result = await this.oracleService.executeQuery(query, queryParams);

      const uomList: MetaUomListDto[] = result.rows.map((row) => ({
        UNIT_OF_MEASURE: row.UNIT_OF_MEASURE,
        UOM_CODE: row.UOM_CODE,
      }));

      const response: MetaUomListResponseDto = {
        data: uomList,
        count: uomList.length,
        status: true,
        message: 'UOM list retrieved successfully',
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
        `Error in getUomListFromOracleByUomCode: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving UOM list data: ${error.message}`,
      };
    }
  }

  async findAllUomLists(params: UomListQueryDto): Promise<MetaUomListResponseDto> {
    this.logger.log('==== MICROSERVICE: Find all UOM lists ====');
    
    const cacheKey = `uom_list:findAll:page:${params.page || 1}:limit:${params.limit || 10}:search:${params.search || 'all'}`;

    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        this.logger.log(`Cache hit for ${cacheKey}`);
        return JSON.parse(cachedData as string) as MetaUomListResponseDto;
      }
    } catch (error) {
      this.logger.error(`Error accessing Redis cache: ${error.message}`);
    }

    try {
      let query = `
        SELECT UNIT_OF_MEASURE, UOM_CODE  
        FROM XTD_INV_ITEM_UOM_ROKOK_V
      `;
      const queryParams: any[] = [];

      if (params.search) {
        query += ` WHERE UPPER(UNIT_OF_MEASURE) LIKE UPPER(?) OR UPPER(UOM_CODE) LIKE UPPER(?)`;
        queryParams.push(`%${params.search}%`, `%${params.search}%`);
      }

      query += ` ORDER BY UOM_CODE`;

      if (params.limit) {
        const offset = ((params.page || 1) - 1) * params.limit;
        query += ` OFFSET ${offset} ROWS FETCH NEXT ${params.limit} ROWS ONLY`;
      }

      const result = await this.oracleService.executeQuery(query, queryParams);
      const data = result.rows as MetaUomListDto[];

      const response: MetaUomListResponseDto = {
        data,
        count: data.length,
        status: true,
        message: 'UOM lists retrieved successfully',
      };

      try {
        await this.redisService.set(cacheKey, JSON.stringify(response), this.CACHE_TTL);
      } catch (cacheError) {
        this.logger.error(`Error storing data in Redis: ${cacheError.message}`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Error in findAllUomLists: ${error.message}`, error.stack);
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving UOM lists: ${error.message}`,
      };
    }
  }

  async countUomLists(params: UomListQueryDto): Promise<{ count: number; status: boolean; message?: string }> {
    this.logger.log('==== MICROSERVICE: Count UOM lists ====');
    
    const cacheKey = `uom_list:count:search:${params.search || 'all'}`;

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
      let query = `SELECT COUNT(*) as count FROM XTD_INV_ITEM_UOM_ROKOK_V`;
      const queryParams: any[] = [];

      if (params.search) {
        query += ` WHERE UPPER(UNIT_OF_MEASURE) LIKE UPPER(?) OR UPPER(UOM_CODE) LIKE UPPER(?)`;
        queryParams.push(`%${params.search}%`, `%${params.search}%`);
      }

      const result = await this.oracleService.executeQuery(query, queryParams);
      const count = result.rows[0]?.count || 0;

      const response = {
        count,
        status: true,
        message: 'UOM lists count retrieved successfully',
      };

      try {
        await this.redisService.set(cacheKey, JSON.stringify(response), this.CACHE_TTL);
      } catch (cacheError) {
        this.logger.error(`Error storing count in Redis: ${cacheError.message}`);
      }

      return response;
    } catch (error) {
      this.logger.error(`Error in countUomLists: ${error.message}`, error.stack);
      return {
        count: 0,
        status: false,
        message: `Error counting UOM lists: ${error.message}`,
      };
    }
  }
}
