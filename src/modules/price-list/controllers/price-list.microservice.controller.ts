import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PriceListService } from '../services/price-list.service';
import { PriceListQueryDto } from '../dtos/price-list.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class PriceListMicroserviceController {
  constructor(private readonly priceListService: PriceListService) {}

  @MessagePattern('price-list.findAll')
  async findAll(@Payload() dto: PriceListQueryDto) {
    return this.priceListService.findAllPriceLists(dto);
  }

  @MessagePattern('price-list.findById')
  async findById(
    @Payload() dto: { priceListId: number; priceListLineId: number },
  ) {
    return this.priceListService.findPriceListById(
      dto.priceListId,
      dto.priceListLineId,
    );
  }

  @MessagePattern('price-list.getCount')
  async getCount(@Payload() dto: PriceListQueryDto) {
    return this.priceListService.countPriceLists(dto);
  }
}
