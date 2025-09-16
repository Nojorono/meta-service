import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import {
    WeekSalesDto,
    WeekSalesResponseDto,
    WeekSalesQueryDto,
} from '../dtos/week-sales.dtos';

@Injectable()
export class WeekSalesService {
    private readonly logger = new Logger(WeekSalesService.name);
    private readonly CACHE_TTL = 60 * 60;

    constructor(
        private readonly oracleService: OracleService,
        private readonly redisService: RedisService,
    ) { }

    async getWeekSalesByYear(tahun: string): Promise<WeekSalesResponseDto> {
        const cacheKey = `week_sales:year:${tahun}`;

        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                this.logger.log(`Cache hit for ${cacheKey}`);
                return JSON.parse(cachedData as string) as WeekSalesResponseDto;
            }
            this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
        } catch (error) {
            this.logger.error(
                `Error accessing Redis cache: ${error.message}`,
                error.stack,
            );
        }

        try {
            const query = `
        SELECT * FROM xtd_period_week_v 
        WHERE TAHUN = :tahun
        ORDER BY MINGGU
      `;

            const result = await this.oracleService.executeQuery(query, [tahun]);

            const weekSales: WeekSalesDto[] = result.rows.map((row) => ({
                BULAN: row.BULAN,
                MINGGU: row.MINGGU,
                QUARTER: row.QUARTER,
                TAHUN: row.TAHUN,
                TANGGAL_AKHIR_MINGGU: row.TANGGAL_AKHIR_MINGGU,
                TANGGAL_AKHIR_MINGGU_REAL: row.TANGGAL_AKHIR_MINGGU_REAL,
                TANGGAL_AWAL_MINGGU: row.TANGGAL_AWAL_MINGGU,
                TANGGAL_AWAL_MINGGU_REAL: row.TANGGAL_AWAL_MINGGU_REAL,
            }));

            const response: WeekSalesResponseDto = {
                data: weekSales,
                count: weekSales.length,
                status: true,
                message: 'Week sales data retrieved successfully from Oracle',
            };

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
                `Error in getWeekSalesByYear: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving week sales data: ${error.message}`,
            };
        }
    }

    async findWeekByDate(date: string): Promise<WeekSalesResponseDto> {
        const cacheKey = `week_sales:date:${date}`;

        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                this.logger.log(`Cache hit for ${cacheKey}`);
                return JSON.parse(cachedData as string) as WeekSalesResponseDto;
            }
            this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
        } catch (error) {
            this.logger.error(
                `Error accessing Redis cache: ${error.message}`,
                error.stack,
            );
        }

        try {
            const query = `
        SELECT * FROM xtd_period_week_v 
        WHERE TO_DATE(:1, 'YYYY-MM-DD') BETWEEN TANGGAL_AWAL_MINGGU AND TANGGAL_AKHIR_MINGGU
        ORDER BY MINGGU
      `;

            const result = await this.oracleService.executeQuery(query, [date]);

            const weekSales: WeekSalesDto[] = result.rows.map((row) => ({
                BULAN: row.BULAN,
                MINGGU: row.MINGGU,
                QUARTER: row.QUARTER,
                TAHUN: row.TAHUN,
                TANGGAL_AKHIR_MINGGU: row.TANGGAL_AKHIR_MINGGU,
                TANGGAL_AKHIR_MINGGU_REAL: row.TANGGAL_AKHIR_MINGGU_REAL,
                TANGGAL_AWAL_MINGGU: row.TANGGAL_AWAL_MINGGU,
                TANGGAL_AWAL_MINGGU_REAL: row.TANGGAL_AWAL_MINGGU_REAL,
            }));

            const response: WeekSalesResponseDto = {
                data: weekSales,
                count: weekSales.length,
                status: true,
                message: 'Week data found for the specified date',
            };

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
                `Error in findWeekByDate: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error finding week by date: ${error.message}`,
            };
        }
    }

    async findAllWeekSales(params: WeekSalesQueryDto): Promise<WeekSalesResponseDto> {
        this.logger.log('==== MICROSERVICE: Find all week sales ====');

        const cacheKey = `week_sales:findAll:${params.tahun || 'all'}:${params.search || 'all'}`;

        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                this.logger.log(`Cache hit for ${cacheKey}`);
                return JSON.parse(cachedData as string) as WeekSalesResponseDto;
            }
        } catch (error) {
            this.logger.error(`Error accessing Redis cache: ${error.message}`);
        }

        try {
            let query = `
        SELECT * FROM xtd_period_week_v
        WHERE 1=1
      `;
            const queryParams: any[] = [];

            if (params.tahun) {
                query += ` AND TAHUN = :tahun`;
                queryParams.push(params.tahun);
            }

            if (params.search) {
                query += ` AND (MINGGU LIKE :search OR BULAN LIKE :search)`;
                queryParams.push(`%${params.search}%`);
                queryParams.push(`%${params.search}%`);
            }

            query += ` ORDER BY MINGGU`;

            if (params.limit) {
                const offset = ((params.page || 1) - 1) * params.limit;
                query += ` OFFSET ${offset} ROWS FETCH NEXT ${params.limit} ROWS ONLY`;
            }

            const result = await this.oracleService.executeQuery(query, queryParams);
            const data = result.rows as WeekSalesDto[];

            const response: WeekSalesResponseDto = {
                data,
                count: data.length,
                status: true,
                message: 'Week sales data retrieved successfully',
            };

            try {
                await this.redisService.set(cacheKey, JSON.stringify(response), this.CACHE_TTL);
            } catch (cacheError) {
                this.logger.error(`Error storing data in Redis: ${cacheError.message}`);
            }

            return response;
        } catch (error) {
            this.logger.error(`Error in findAllWeekSales: ${error.message}`, error.stack);
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving week sales data: ${error.message}`,
            };
        }
    }
}
