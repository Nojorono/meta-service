import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProvinceService } from '../services/province.service';
import { ProvinceQueryDto } from '../dtos/province.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class ProvinceMicroserviceController {
  constructor(private readonly provinceService: ProvinceService) {}

  @MessagePattern('province.findAll')
  async findAll(@Payload() dto: ProvinceQueryDto) {
    return this.provinceService.findAllProvinces(dto);
  }

  @MessagePattern('province.findByCode')
  async findByCode(@Payload() dto: { provinsiCode: string }) {
    return this.provinceService.findProvinceByCode(dto.provinsiCode);
  }

  @MessagePattern('province.getCount')
  async getCount(@Payload() dto: ProvinceQueryDto) {
    return this.provinceService.getProvinceCount(dto);
  }
}
