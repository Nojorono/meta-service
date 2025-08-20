import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ArReceiptMethodService } from '../services/ar-receipt-method.service';
import { ArReceiptMethodQueryDto } from '../dtos/ar-receipt-method.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class ArReceiptMethodMicroserviceController {
  constructor(
    private readonly arReceiptMethodService: ArReceiptMethodService,
  ) {}

  @MessagePattern('receipt-method.findAll')
  async findAll(@Payload() dto: ArReceiptMethodQueryDto) {
    return this.arReceiptMethodService.findAllReceiptMethods(dto);
  }

  @MessagePattern('receipt-method.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.arReceiptMethodService.findReceiptMethodById(dto.id);
  }

  @MessagePattern('receipt-method.getCount')
  async getCount(@Payload() dto: ArReceiptMethodQueryDto) {
    return this.arReceiptMethodService.countReceiptMethods(dto);
  }
}
