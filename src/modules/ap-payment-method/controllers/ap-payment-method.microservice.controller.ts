import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApPaymentMethodService } from '../services/ap-payment-method.service';
import { ApPaymentMethodQueryDto } from '../dtos/ap-payment-method.dtos';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
@Internal()
export class ApPaymentMethodMicroserviceController {
  constructor(
    private readonly apPaymentMethodService: ApPaymentMethodService,
  ) {}

  @MessagePattern('ap-payment-method.findAll')
  async findAll(@Payload() dto: ApPaymentMethodQueryDto) {
    return this.apPaymentMethodService.findAllPaymentMethods(dto);
  }

  @MessagePattern('ap-payment-method.getCount')
  async getCount(@Payload() dto: ApPaymentMethodQueryDto) {
    return this.apPaymentMethodService.countPaymentMethods(dto);
  }

  @MessagePattern('ap-payment-method.findByName')
  async findByName(@Payload() dto: { name: string }) {
    return this.apPaymentMethodService.findAllPaymentMethods({
      apPaymentMethodName: dto.name,
    });
  }

  @MessagePattern('ap-payment-method.findByCode')
  async findByCode(@Payload() dto: { code: string }) {
    return this.apPaymentMethodService.findAllPaymentMethods({
      apPaymentMethodCode: dto.code,
    });
  }
}
