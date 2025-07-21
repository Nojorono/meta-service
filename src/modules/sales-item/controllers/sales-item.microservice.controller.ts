import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesItemMetaService } from '../services/sales-item.service';
import { MetaSalesItemDtoByDate } from '../dtos/sales-item.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SalesItemMicroserviceController {
  constructor(private readonly salesItemService: SalesItemMetaService) {}

  @MessagePattern('sales-item.findByDate')
  async findByDate(@Payload() dto: MetaSalesItemDtoByDate) {
    return this.salesItemService.getSalesItemsFromOracleByDate(dto);
  }

  @MessagePattern('sales-item.findAll')
  async findAll() {
    return this.salesItemService.getSalesItemsFromOracleByDate();
  }
}
