import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesItemConversionService } from '../services/sales-item-conversion.service';
import { SalesItemConversionQueryDto } from '../dtos/sales-item-conversion.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SalesItemConversionMicroserviceController {
  constructor(
    private readonly salesItemConversionService: SalesItemConversionService,
  ) {}

  @MessagePattern('sales-item-conversion.findAll')
  async findAll(@Payload() dto: SalesItemConversionQueryDto) {
    return this.salesItemConversionService.findAllSalesItemConversions(dto);
  }

  @MessagePattern('sales-item-conversion.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.salesItemConversionService.findSalesItemConversionById(dto.id);
  }

  @MessagePattern('sales-item-conversion.getCount')
  async getCount(@Payload() dto: SalesItemConversionQueryDto) {
    return this.salesItemConversionService.countSalesItemConversions(dto);
  }
}
