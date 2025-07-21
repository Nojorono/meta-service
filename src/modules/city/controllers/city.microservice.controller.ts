import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CityService } from '../services/city.service';
import { CityQueryDto } from '../dtos/city.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class CityMicroserviceController {
  constructor(private readonly cityService: CityService) {}

  @MessagePattern('city.findAll')
  async findAll(@Payload() dto: CityQueryDto) {
    return this.cityService.findAllCities(dto);
  }

  @MessagePattern('city.findByCode')
  async findByCode(@Payload() dto: { KOTAMADYA_CODE: string }) {
    return this.cityService.findCityByCode(dto.KOTAMADYA_CODE);
  }

  @MessagePattern('city.findByProvinceCode')
  async findByProvinceCode(@Payload() dto: { PROVINSI_CODE: string }) {
    return this.cityService.findCitiesByProvinceCode(dto.PROVINSI_CODE);
  }

  @MessagePattern('city.getCount')
  async getCount(@Payload() dto: CityQueryDto) {
    return this.cityService.getCityCount(dto);
  }
}
