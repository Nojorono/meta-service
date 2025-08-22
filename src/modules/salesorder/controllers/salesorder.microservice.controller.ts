import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesOrderService } from '../services/salesorder.service';
import { Internal } from 'src/common/decorators/internal.decorator';
import {
    CreateSalesOrderHeaderDto,
    CreateSalesOrderLineDto,
    CreateSalesOrderWithLinesDto,
    CreateSalesOrderReturnDto,
} from '../dtos/salesorder.dtos';

@Controller()
export class SalesOrderMicroserviceController {
    constructor(private readonly salesOrderService: SalesOrderService) { }

    @MessagePattern('salesorder.createHeader')
    @Internal()
    async createHeader(@Payload() data: CreateSalesOrderHeaderDto) {
        try {
            return await this.salesOrderService.createSalesOrderHeader(data);
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('salesorder.createLine')
    @Internal()
    async createLine(@Payload() data: CreateSalesOrderLineDto) {
        try {
            return await this.salesOrderService.createSalesOrderLine(data);
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('salesorder.createWithLines')
    @Internal()
    async createWithLines(@Payload() data: CreateSalesOrderWithLinesDto) {
        try {
            return await this.salesOrderService.createSalesOrderWithLines(data);
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('salesorder.createReturn')
    @Internal()
    async createReturn(@Payload() data: CreateSalesOrderReturnDto) {
        try {
            return await this.salesOrderService.createSalesOrderReturn(data);
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
