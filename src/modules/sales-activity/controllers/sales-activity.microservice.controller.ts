import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesActivityService } from '../services/sales-activity.service';
import { SalesActivityQueryDto } from '../dtos/sales-activity.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SalesActivityMicroserviceController {
  constructor(private readonly salesActivityService: SalesActivityService) {}

  @MessagePattern('sales-activity.findAll')
  async findAll(@Payload() dto: SalesActivityQueryDto) {
    return this.salesActivityService.findAllSalesActivities(dto);
  }

  @MessagePattern('sales-activity.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.salesActivityService.findSalesActivityById(dto.id);
  }

  @MessagePattern('sales-activity.getCount')
  async getCount(@Payload() dto: SalesActivityQueryDto) {
    return this.salesActivityService.countSalesActivities(dto);
  }
}
