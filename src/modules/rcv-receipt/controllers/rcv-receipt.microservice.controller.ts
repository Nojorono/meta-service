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
  constructor(private readonly rcvReceiptService: RcvReceiptService) {}

  @MessagePattern('rcv-receipt.create')
  @Internal()
  async create(
    @Payload() payload: CreateRcvReceiptDto,
  ): Promise<RcvReceiptResponseDto> {
    return this.rcvReceiptService.create(payload);
  }
}
