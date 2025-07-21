import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DistrictService } from '../services/district.service';
import { DistrictQueryDto } from '../dtos/district.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class DistrictMicroserviceController {
  constructor(private readonly districtService: DistrictService) {}

  @MessagePattern('district.findAll')
  async findAll(@Payload() dto: DistrictQueryDto) {
    return this.districtService.findAllDistricts(dto);
  }

  @MessagePattern('district.findByCode')
  async findByCode(@Payload() dto: { kecamatanCode: string }) {
    return this.districtService.findDistrictByCode(dto.kecamatanCode);
  }

  @MessagePattern('district.findByCityCode')
  async findByCityCode(@Payload() dto: { kotamadyaCode: string }) {
    return this.districtService.findDistrictsByCityCode(dto.kotamadyaCode);
  }

  @MessagePattern('district.getCount')
  async getCount(@Payload() dto: DistrictQueryDto) {
    return this.districtService.getDistrictCount(dto);
  }
}
