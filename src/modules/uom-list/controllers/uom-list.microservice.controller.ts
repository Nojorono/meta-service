import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UomListService } from '../uom-list.service';
import { MetaUomListDtoByUomCode, UomListQueryDto } from '../dto/uom-list.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class UomListMicroserviceController {
  constructor(private readonly uomListService: UomListService) {}

  @MessagePattern('uom-list.findAll')
  async findAll(@Payload() dto: UomListQueryDto) {
    return this.uomListService.findAllUomLists(dto);
  }

  @MessagePattern('uom-list.findByUomCode')
  async findByUomCode(@Payload() dto: MetaUomListDtoByUomCode) {
    return this.uomListService.getUomListFromOracleByUomCode(dto);
  }

  @MessagePattern('uom-list.getCount')
  async getCount(@Payload() dto: UomListQueryDto) {
    return this.uomListService.countUomLists(dto);
  }
}
