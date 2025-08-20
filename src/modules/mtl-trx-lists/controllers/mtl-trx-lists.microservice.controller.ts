import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MtlTrxListsService } from '../services/mtl-trx-lists.service';
import { MtlTrxListsQueryDto } from '../dtos/mtl-trx-lists.dtos';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
@Internal()
export class MtlTrxListsMicroserviceController {
  private readonly logger = new Logger(MtlTrxListsMicroserviceController.name);

  constructor(private readonly mtlTrxListsService: MtlTrxListsService) {}

  @MessagePattern('mtl_trx_lists.findAll')
  async findAll(@Payload() dto: MtlTrxListsQueryDto) {
    return this.mtlTrxListsService.findAll(dto);
  }

  @MessagePattern('mtl_trx_lists.findOne')
  async findById(@Payload() dto: { id: number }) {
    return this.mtlTrxListsService.findOne(dto.id);
  }

  @MessagePattern('mtl_trx_lists.getCount')
  async getCount(@Payload() dto: MtlTrxListsQueryDto) {
    return this.mtlTrxListsService.countMtlTrxLists(dto);
  }
}
