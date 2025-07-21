import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemListMetaService } from '../services/item-list.service';
import { MetaItemListDtoByItemCode } from '../dtos/item-list.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class ItemListMicroserviceController {
  constructor(private readonly itemListService: ItemListMetaService) {}

  @MessagePattern('item-list.findByItemCode')
  async findByItemCode(@Payload() dto: MetaItemListDtoByItemCode) {
    return this.itemListService.getItemListFromOracleByItemCode(dto);
  }

  @MessagePattern('item-list.findAll')
  async findAll() {
    return this.itemListService.getItemListFromOracleByItemCode();
  }
}
