import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PositionService } from '../services/position.service';
import { PositionQueryDto } from '../dtos/position.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class PositionMicroserviceController {
  constructor(private readonly positionService: PositionService) {}

  @MessagePattern('position.findAll')
  async findAll(@Payload() dto: PositionQueryDto) {
    return this.positionService.findAllPositions(dto);
  }

  @MessagePattern('position.findById')
  async findById(@Payload() dto: { positionId: number }) {
    return this.positionService.findPositionById(dto.positionId);
  }

  @MessagePattern('position.findByCode')
  async findByCode(@Payload() dto: { positionCode: string }) {
    return this.positionService.findPositionByCode(dto.positionCode);
  }

  @MessagePattern('position.findByOrganizationId')
  async findByOrganizationId(@Payload() dto: { organizationId: number }) {
    return this.positionService.findPositionsByOrganizationId(
      dto.organizationId,
    );
  }

  @MessagePattern('position.getCount')
  async getCount(@Payload() dto: PositionQueryDto) {
    return this.positionService.getPositionCount(dto);
  }
}
