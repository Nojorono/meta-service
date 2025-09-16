import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { WeekSalesService } from '../services/week-sales.service';
import { WeekSalesQueryDto, WeekSalesResponseDto } from '../dtos/week-sales.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('Week Sales')
@Controller('week-sales')
@AuthSwagger()
export class WeekSalesController {
    private readonly logger = new Logger(WeekSalesController.name);

    constructor(private readonly weekSalesService: WeekSalesService) {
        this.logger.log('WeekSalesController initialized');
    }

    @Get('test')
    @ApiOperation({ summary: 'Test endpoint to verify controller is working' })
    @ApiResponse({
        status: 200,
        description: 'Test response',
    })
    async test(): Promise<{ message: string; status: boolean }> {
        return {
            message: 'Week Sales Controller is working!',
            status: true,
        };
    }

    @Get('year/:tahun')
    @ApiOperation({ summary: 'Get week sales data by year' })
    @ApiResponse({
        status: 200,
        description: 'Week sales data for the specified year retrieved successfully',
        type: WeekSalesResponseDto,
    })
    @ApiParam({
        name: 'tahun',
        description: 'Year to filter by',
        example: '2024',
        type: String,
    })
    async getByYear(@Param('tahun') tahun: string): Promise<WeekSalesResponseDto> {
        this.logger.log(`Getting week sales data for year: ${tahun}`);
        try {
            return await this.weekSalesService.getWeekSalesByYear(tahun);
        } catch (error) {
            this.logger.error(`Error retrieving week sales data for year ${tahun}: ${error.message}`);
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving week sales data for year ${tahun}: ${error.message}`,
            };
        }
    }

    @Get('date/:date')
    @ApiOperation({ summary: 'Find week by specific date' })
    @ApiResponse({
        status: 200,
        description: 'Week data for the specified date retrieved successfully',
        type: WeekSalesResponseDto,
    })
    @ApiParam({
        name: 'date',
        description: 'Date to find week for (YYYY-MM-DD format)',
        example: '2024-01-15',
        type: String,
    })
    async getByDate(@Param('date') date: string): Promise<WeekSalesResponseDto> {
        try {
            return await this.weekSalesService.findWeekByDate(date);
        } catch (error) {
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error finding week by date ${date}: ${error.message}`,
            };
        }
    }

    @Get()
    @ApiOperation({ summary: 'Get all week sales data' })
    @ApiResponse({
        status: 200,
        description: 'Week sales data retrieved successfully',
        type: WeekSalesResponseDto,
    })
    @ApiQuery({
        name: 'tahun',
        required: false,
        description: 'Year to filter by',
        example: '2024',
        type: String,
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description: 'Search term for week or month',
        example: '01',
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
    async findAll(@Query() params: WeekSalesQueryDto): Promise<WeekSalesResponseDto> {
        try {
            return await this.weekSalesService.findAllWeekSales(params);
        } catch (error) {
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving week sales data: ${error.message}`,
            };
        }
    }
}
