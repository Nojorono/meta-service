import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReceiptMethodService } from '../services/receipt-method.service';
import { ReceiptMethodQueryDto } from '../dtos/receipt-method.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class ReceiptMethodMicroserviceController {
  constructor(private readonly receiptMethodService: ReceiptMethodService) {}

  @MessagePattern('receipt-method.findAll')
  async findAll(@Payload() dto: ReceiptMethodQueryDto) {
    return this.receiptMethodService.findAllReceiptMethods(dto);
  }

  @MessagePattern('receipt-method.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.receiptMethodService.findReceiptMethodById(dto.id);
  }

  @MessagePattern('receipt-method.getCount')
  async getCount(@Payload() dto: ReceiptMethodQueryDto) {
    return this.receiptMethodService.countReceiptMethods(dto);
  }
}
