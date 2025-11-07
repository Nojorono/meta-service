import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HrOperatingUnitsService } from '../services/hr-operating-units.service';
import { HrOperatingUnitsQueryDto } from '../dtos/hr-operating-units.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class HrOperatingUnitsMicroserviceController {
  constructor(
    private readonly hrOperatingUnitsService: HrOperatingUnitsService,
  ) {}

  @MessagePattern('hr-operating-units.findAll')
  async findAll(@Payload() dto: HrOperatingUnitsQueryDto) {
    return this.hrOperatingUnitsService.findAllOperatingUnits(dto);
  }

  @MessagePattern('hr-operating-units.findById')
  async findById(@Payload() dto: { orgId: number }) {
    return this.hrOperatingUnitsService.findOperatingUnitById(dto.orgId);
  }

  @MessagePattern('hr-operating-units.findByCode')
  async findByCode(@Payload() dto: { orgCode: string }) {
    return this.hrOperatingUnitsService.findOperatingUnitByCode(dto.orgCode);
  }

  @MessagePattern('hr-operating-units.getCount')
  async getCount(@Payload() dto: HrOperatingUnitsQueryDto) {
    return this.hrOperatingUnitsService.getOperatingUnitsCount(dto);
  }
}

