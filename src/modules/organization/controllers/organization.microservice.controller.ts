import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { OrganizationService } from '../services/organization.service';
import { OrganizationQueryDto } from '../dtos/organization.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class OrganizationMicroserviceController {
  constructor(private readonly organizationService: OrganizationService) {}

  @MessagePattern('organization.findAll')
  async findAll(@Payload() dto: OrganizationQueryDto) {
    return this.organizationService.findAllOrganizations(dto);
  }

  @MessagePattern('organization.findById')
  async findById(@Payload() dto: { organizationId: number }) {
    return this.organizationService.findOrganizationById(dto.organizationId);
  }

  @MessagePattern('organization.findByCode')
  async findByCode(@Payload() dto: { organizationCode: string }) {
    return this.organizationService.findOrganizationByCode(
      dto.organizationCode,
    );
  }

  @MessagePattern('organization.getCount')
  async getCount(@Payload() dto: OrganizationQueryDto) {
    return this.organizationService.getOrganizationCount(dto);
  }
}
