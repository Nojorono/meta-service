import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from '../../../common/decorators/internal.decorator';
import { ActualFpprService } from '../services/actual-fppr.service';
import { CreateActualFpprDto } from '../dtos/actual-fppr.dtos';

@Controller()
@Internal()
export class ActualFpprMicroserviceController {
  constructor(private readonly actualFpprService: ActualFpprService) {}

  @MessagePattern('actual_fppr.create')
  async createActualFpprMicroservice(
    @Payload() createDto: CreateActualFpprDto,
  ) {
    try {
      const data = await this.actualFpprService.createActualFppr(createDto);
      return { success: true, data };
    } catch (error) {
      throw error;
    }
  }
}
