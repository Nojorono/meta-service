import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from 'src/common/decorators/internal.decorator';
import {
  CreateMoveOrderWmsDto,
  MoveOrderWmsResponseDto,
} from '../dtos/move-order-wms.dtos';
import { MoveOrderWmsService } from '../services/move-order-wms.service';

@Controller()
export class MoveOrderWmsMicroserviceController {
  constructor(private readonly moveOrderWmsService: MoveOrderWmsService) { }

  @MessagePattern('move-order-wms.create')
  @Internal()
  async create(
    @Payload() payload: CreateMoveOrderWmsDto | CreateMoveOrderWmsDto[],
  ): Promise<MoveOrderWmsResponseDto> {
    const list = Array.isArray(payload) ? payload : [payload];
    console.log(list);
    const result = await this.moveOrderWmsService.create(list);
    console.log(result);
    return result;
  }

  @MessagePattern('move-order-wms.findBySourceHeaderId')
  @Internal()
  async getBySourceHeaderId(
    @Payload() payload: { source_header_id: string },
  ): Promise<MoveOrderWmsResponseDto> {
    return this.moveOrderWmsService.getBySourceHeaderId(payload.source_header_id);
  }
}
