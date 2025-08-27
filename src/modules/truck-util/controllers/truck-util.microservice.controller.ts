import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TruckUtilService } from '../truck-util.service';
import { MetaTruckUtilDtoByItem, TruckUtilQueryDto } from '../dto/truck-util.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class TruckUtilMicroserviceController {
  constructor(private readonly truckUtilService: TruckUtilService) {}

  @MessagePattern('truck-util.findAll')
  async findAll(@Payload() dto: TruckUtilQueryDto) {
    return this.truckUtilService.findAllTruckUtils(dto);
  }

  @MessagePattern('truck-util.findByItem')
  async findByItem(@Payload() dto: MetaTruckUtilDtoByItem) {
    return this.truckUtilService.getTruckUtilFromOracleByItem(dto);
  }

  @MessagePattern('truck-util.getCount')
  async getCount(@Payload() dto: TruckUtilQueryDto) {
    return this.truckUtilService.countTruckUtils(dto);
  }
}
