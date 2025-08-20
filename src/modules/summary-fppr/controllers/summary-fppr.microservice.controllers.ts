import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from '../../../common/decorators/internal.decorator';
import { SummaryFpprService } from '../services/summary-fppr.service';
import { SummaryFpprQueryDto } from '../dtos/summary-fppr.dtos';

@Controller()
@Internal()
export class SummaryFpprMicroserviceController {
  constructor(private readonly summaryFpprService: SummaryFpprService) {}

  @MessagePattern('summary_fppr.findAll')
  async findAllMicroservice(@Payload() query: SummaryFpprQueryDto) {
    try {
      const data = await this.summaryFpprService.findAllSummaryFpprs(query);
      const total = await this.summaryFpprService.countSummaryFpprs(query);
      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern('summary_fppr.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.summaryFpprService.findSummaryFpprById(data.id);
    } catch (error) {
      throw error;
    }
  }
}
