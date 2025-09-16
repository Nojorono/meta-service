import {
    Controller,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WeekSalesService } from '../services/week-sales.service';
import { WeekSalesQueryDto, WeekSalesResponseDto } from '../dtos/week-sales.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller('week-sales')
@Internal()
export class WeekSalesMicroserviceController {
    constructor(private readonly weekSalesService: WeekSalesService) { }

    @MessagePattern('week_sales.findAll')
    async findAll(@Payload() params: WeekSalesQueryDto): Promise<WeekSalesResponseDto> {
        try {
            return await this.weekSalesService.findAllWeekSales(params);
        } catch (error) {
            throw new HttpException(
                {
                    status: false,
                    message: `Error retrieving week sales data: ${error.message}`,
                    data: [],
                    count: 0,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @MessagePattern('week_sales.getByYear')
    async getByYear(@Payload() data: { tahun: string }): Promise<WeekSalesResponseDto> {
        try {
            return await this.weekSalesService.getWeekSalesByYear(data.tahun);
        } catch (error) {
            throw new HttpException(
                {
                    status: false,
                    message: `Error retrieving week sales data for year ${data.tahun}: ${error.message}`,
                    data: [],
                    count: 0,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @MessagePattern('week_sales.getByDate')
    async getByDate(@Payload() data: { date: string }): Promise<WeekSalesResponseDto> {
        try {
            return await this.weekSalesService.findWeekByDate(data.date);
        } catch (error) {
            throw new HttpException(
                {
                    status: false,
                    message: `Error finding week by date ${data.date}: ${error.message}`,
                    data: [],
                    count: 0,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
