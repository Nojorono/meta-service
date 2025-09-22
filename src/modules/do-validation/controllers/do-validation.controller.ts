import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { DoValidationService } from '../services/do-validation.service';
import { DoValidationQueryDto, DoValidationResponseDto } from '../dtos/do-validation.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('DO Validation')
@Controller('do-validation')
@AuthSwagger()
export class DoValidationController {
    private readonly logger = new Logger(DoValidationController.name);

    constructor(private readonly doValidationService: DoValidationService) {
        this.logger.log('DoValidationController initialized');
    }

    @Get('test')
    @ApiOperation({ summary: 'Test endpoint to verify controller is working' })
    @ApiResponse({
        status: 200,
        description: 'Test response',
    })
    async test(): Promise<{ message: string; status: boolean }> {
        return {
            message: 'DO Validation Controller is working!',
            status: true,
        };
    }

    @Get('no-surat-jalan/:noSuratJalan')
    @ApiOperation({ summary: 'Get DO validation data by delivery order number' })
    @ApiResponse({
        status: 200,
        description: 'DO validation data for the specified delivery order retrieved successfully',
        type: DoValidationResponseDto,
    })
    @ApiParam({
        name: 'noSuratJalan',
        description: 'Delivery order number to filter by',
        example: 'DO-2024-001',
        type: String,
    })
    async getByNoSuratJalan(@Param('noSuratJalan') noSuratJalan: string): Promise<DoValidationResponseDto> {
        this.logger.log(`Getting DO validation data for delivery order: ${noSuratJalan}`);
        try {
            return await this.doValidationService.findByNoSuratJalan(noSuratJalan);
        } catch (error) {
            this.logger.error(`Error retrieving DO validation data for delivery order ${noSuratJalan}: ${error.message}`);
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving DO validation data for delivery order ${noSuratJalan}: ${error.message}`,
            };
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all DO validation data' })
    @ApiResponse({
        status: 200,
        description: 'DO validation data retrieved successfully',
        type: DoValidationResponseDto,
    })
    @ApiQuery({
        name: 'no_surat_jalan',
        required: false,
        description: 'Filter by specific delivery order number',
        example: 'DO-2024-001',
        type: String,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number for pagination',
        example: 1,
        type: Number,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Number of items per page',
        example: 10,
        type: Number,
    })
    async findAll(@Query() params: DoValidationQueryDto): Promise<DoValidationResponseDto> {
        try {
            return await this.doValidationService.findAllDoValidation(params);
        } catch (error) {
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving DO validation data: ${error.message}`,
            };
        }
    }
}
