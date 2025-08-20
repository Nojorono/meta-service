import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesOrderTypesService } from '../services/sales-order-types.service';
import { SalesOrderTypesQueryDto } from '../dtos/sales-order-types.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SalesOrderTypesMicroserviceController {
  constructor(
    private readonly salesOrderTypesService: SalesOrderTypesService,
  ) {}

  @MessagePattern('sales-order-types.findAll')
  async findAll(@Payload() dto: SalesOrderTypesQueryDto) {
    return this.salesOrderTypesService.findAllSalesOrderTypes(dto);
  }

  @MessagePattern('sales-order-types.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.salesOrderTypesService.findSalesOrderTypeById(dto.id);
  }

  @MessagePattern('sales-order-types.getCount')
  async getCount(@Payload() dto: SalesOrderTypesQueryDto) {
    return this.salesOrderTypesService.countSalesOrderTypes(dto);
  }
}
