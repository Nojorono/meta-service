import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ArCustomersSdService } from '../services/ar-customers-sd.service';
import { ArCustomersSdQueryDto } from '../dtos/ar-customers-sd.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class ArCustomersSdMicroserviceController {
  constructor(
    private readonly arCustomersSdService: ArCustomersSdService,
  ) {}

  @MessagePattern('ar-customers-sd.findAll')
  async findAll(@Payload() dto: ArCustomersSdQueryDto) {
    return this.arCustomersSdService.findAllCustomers(dto);
  }

  @MessagePattern('ar-customers-sd.findById')
  async findById(@Payload() dto: { custAccountId: number }) {
    return this.arCustomersSdService.findCustomerById(dto.custAccountId);
  }

  @MessagePattern('ar-customers-sd.findByNumber')
  async findByNumber(@Payload() dto: { customerNumber: string }) {
    return this.arCustomersSdService.findCustomerByNumber(dto.customerNumber);
  }

  @MessagePattern('ar-customers-sd.getCount')
  async getCount(@Payload() dto: ArCustomersSdQueryDto) {
    return this.arCustomersSdService.getCustomersCount(dto);
  }
}

