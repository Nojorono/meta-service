import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from 'src/common/decorators/internal.decorator';
import {
  CreateRcvReceiptDto,
  RcvReceiptResponseDto,
} from '../dtos/rcv-receipt.dtos';
import { RcvReceiptService } from '../services/rcv-receipt.service';

@Controller()
export class RcvReceiptMicroserviceController {
  constructor(private readonly rcvReceiptService: RcvReceiptService) { }

  @MessagePattern('rcv-receipt.create')
  @Internal()
  async create(
    @Payload() payload: CreateRcvReceiptDto | CreateRcvReceiptDto[],
  ): Promise<any> {
    const list = Array.isArray(payload) ? payload : [payload];
    console.log(list);
    return this.rcvReceiptService.create(list);
  }

  @MessagePattern('rcv-receipt.findBySourceHeaderId')
  @Internal()
  async findBySourceHeaderId(
    @Payload() payload: { source_header_id: string },
  ): Promise<RcvReceiptResponseDto> {
    return this.rcvReceiptService.getBySourceHeaderId(payload.source_header_id);
  }
}
