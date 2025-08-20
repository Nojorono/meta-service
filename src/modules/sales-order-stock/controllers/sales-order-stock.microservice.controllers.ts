import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesOrderStockService } from '../services/sales-order-stock.service';
import { SalesOrderStockQueryDto } from '../dtos/sales-order-stock.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SalesOrderStockMicroserviceController {
  constructor(
    private readonly salesOrderStockService: SalesOrderStockService,
  ) {}

  @MessagePattern('sales-order-stock.findAll')
  async findAll(@Payload() dto: SalesOrderStockQueryDto) {
    return this.salesOrderStockService.findAllSalesOrderStock(dto);
  }

  @MessagePattern('sales-order-stock.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.salesOrderStockService.findSalesOrderStockById(dto.id);
  }

  @MessagePattern('sales-order-stock.getCount')
  async getCount(@Payload() dto: SalesOrderStockQueryDto) {
    return this.salesOrderStockService.countSalesOrderStock(dto);
  }
}
