import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from 'src/common/decorators/internal.decorator';
import {
  CreatePoInternalReqDto,
  PoInternalReqResponseDto,
} from '../dtos/po-internal-req.dtos';
import { PoInternalReqService } from '../services/po-internal-req.service';

@Controller()
export class PoInternalReqMicroserviceController {
  constructor(private readonly poInternalReqService: PoInternalReqService) {}

  @MessagePattern('po-internal-req.create')
  @Internal()
  async create(
    @Payload() payload: CreatePoInternalReqDto | CreatePoInternalReqDto[],
  ): Promise<PoInternalReqResponseDto> {
    const list = Array.isArray(payload) ? payload : [payload];
    return this.poInternalReqService.create(list);
  }
}
