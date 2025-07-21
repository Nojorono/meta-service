import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesOrderService } from '../services/sales-order.service';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
export class SalesOrderMicroserviceController {
  constructor(private readonly salesOrderService: SalesOrderService) {}

  @MessagePattern('sales-order.findAll')
  @Internal()
  async findAll(@Payload() data: any) {
    try {
      return await this.salesOrderService.findAll(data);
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern('sales-order.findByOrderNumber')
  @Internal()
  async findByOrderNumber(@Payload() data: { order_number: string }) {
    try {
      return await this.salesOrderService.findAll({
        order_number: data.order_number,
        page: 1,
        limit: 100,
      });
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
