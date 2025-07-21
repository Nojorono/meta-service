import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SubDistrictService } from '../services/sub-district.service';
import { SubDistrictQueryDto } from '../dtos/sub-district.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SubDistrictMicroserviceController {
  constructor(private readonly subDistrictService: SubDistrictService) {}

  @MessagePattern('sub-district.findAll')
  async findAll(@Payload() dto: SubDistrictQueryDto) {
    return this.subDistrictService.findAllSubDistricts(dto);
  }

  @MessagePattern('sub-district.findByCode')
  async findByCode(@Payload() dto: { kelurahanCode: string }) {
    return this.subDistrictService.findSubDistrictByCode(dto.kelurahanCode);
  }

  @MessagePattern('sub-district.findByDistrictCode')
  async findByDistrictCode(@Payload() dto: { kecamatanCode: string }) {
    return this.subDistrictService.findSubDistrictsByDistrictCode(
      dto.kecamatanCode,
    );
  }

  @MessagePattern('sub-district.getCount')
  async getCount(@Payload() dto: SubDistrictQueryDto) {
    return this.subDistrictService.getSubDistrictCount(dto);
  }
}
