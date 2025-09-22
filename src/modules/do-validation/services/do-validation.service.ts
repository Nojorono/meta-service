import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import {
    DoValidationDto,
    DoValidationResponseDto,
    DoValidationQueryDto,
} from '../dtos/do-validation.dtos';

@Injectable()
export class DoValidationService {
    private readonly logger = new Logger(DoValidationService.name);
    private readonly CACHE_TTL = 60 * 60;

    constructor(
        private readonly oracleService: OracleService,
        private readonly redisService: RedisService,
    ) { }

    async findAllDoValidation(params: DoValidationQueryDto = {}): Promise<DoValidationResponseDto> {
        const cacheKey = `do_validation:${params.no_surat_jalan || 'all'}:${params.page || 1}:${params.limit || 10}`;

        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                this.logger.log(`Cache hit for ${cacheKey}`);
                return JSON.parse(cachedData as string) as DoValidationResponseDto;
            }
            this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
        } catch (error) {
            this.logger.error(`Error accessing Redis cache: ${error.message}`, error.stack);
        }

        try {
            let query = `
                    SELECT 
                        NO_SURAT_JALAN,
                        COUNT(DISTINCT PO_NUMBER) AS JML_NO_PO,
                        LISTAGG(DISTINCT PO_NUMBER, ', ') WITHIN GROUP (ORDER BY PO_NUMBER) AS DAFTAR_NO_PO
                    FROM 
                        XTD_OM_PRINCIPAL_DO_STG
                    WHERE 1=1
            `;

            const queryParams: any[] = [];
            let paramIndex = 1;

            if (params.no_surat_jalan) {
                query += ` AND NO_SURAT_JALAN = :${paramIndex}`;
                queryParams.push(params.no_surat_jalan);
                paramIndex++;
            }

            query += `
                    GROUP BY 
                        NO_SURAT_JALAN
                    ORDER BY 
                        NO_SURAT_JALAN DESC 
            `;

            if (params.limit) {
                const offset = ((params.page || 1) - 1) * params.limit;
                query += ` OFFSET ${offset} ROWS FETCH NEXT ${params.limit} ROWS ONLY`;
            }

            const result = await this.oracleService.executeQuery(query, queryParams);

            const doValidationData: DoValidationDto[] = result.rows.map((row) => ({
                NO_SURAT_JALAN: row.NO_SURAT_JALAN,
                JML_NO_PO: row.JML_NO_PO,
                DAFTAR_NO_PO: row.DAFTAR_NO_PO,
            }));

            const response: DoValidationResponseDto = {
                data: doValidationData,
                count: doValidationData.length,
                status: true,
                message: 'DO validation data retrieved successfully from Oracle',
            };

            try {
                await this.redisService.set(
                    cacheKey,
                    JSON.stringify(response),
                    this.CACHE_TTL,
                );
                this.logger.log(`Data stored in cache with key ${cacheKey}`);
            } catch (cacheError) {
                this.logger.error(`Error storing data in Redis: ${cacheError.message}`, cacheError.stack);
            }

            return response;
        } catch (error) {
            this.logger.error(`Error in findAllDoValidation: ${error.message}`, error.stack);
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving DO validation data: ${error.message}`,
            };
        }
    }

    async findByNoSuratJalan(noSuratJalan: string): Promise<DoValidationResponseDto> {
        const cacheKey = `do_validation:${noSuratJalan}`;

        try {
            const cachedData = await this.redisService.get(cacheKey);
            if (cachedData) {
                this.logger.log(`Cache hit for ${cacheKey}`);
                return JSON.parse(cachedData as string) as DoValidationResponseDto;
            }
            this.logger.log(`Cache miss for ${cacheKey}, fetching from Oracle`);
        } catch (error) {
            this.logger.error(`Error accessing Redis cache: ${error.message}`, error.stack);
        }

        try {
            const query = `
                    SELECT 
                        NO_SURAT_JALAN,
                        COUNT(DISTINCT PO_NUMBER) AS JML_NO_PO,
                        LISTAGG(DISTINCT PO_NUMBER, ', ') WITHIN GROUP (ORDER BY PO_NUMBER) AS DAFTAR_NO_PO
                    FROM 
                        XTD_OM_PRINCIPAL_DO_STG
                    WHERE NO_SURAT_JALAN = :1
                    GROUP BY 
                        NO_SURAT_JALAN
                    ORDER BY 
                        NO_SURAT_JALAN DESC
            `;

            const result = await this.oracleService.executeQuery(query, [noSuratJalan]);

            const doValidationData: DoValidationDto[] = result.rows.map((row) => ({
                NO_SURAT_JALAN: row.NO_SURAT_JALAN,
                JML_NO_PO: row.JML_NO_PO,
                DAFTAR_NO_PO: row.DAFTAR_NO_PO,
            }));

            const response: DoValidationResponseDto = {
                data: doValidationData,
                count: doValidationData.length,
                status: true,
                message: `DO validation data for ${noSuratJalan} retrieved successfully`,
            };

            try {
                await this.redisService.set(
                    cacheKey,
                    JSON.stringify(response),
                    this.CACHE_TTL,
                );
                this.logger.log(`Data stored in cache with key ${cacheKey}`);
            } catch (cacheError) {
                this.logger.error(`Error storing data in Redis: ${cacheError.message}`, cacheError.stack);
            }

            return response;
        } catch (error) {
            this.logger.error(`Error in findByNoSuratJalan: ${error.message}`, error.stack);
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving DO validation data for ${noSuratJalan}: ${error.message}`,
            };
        }
    }
}
