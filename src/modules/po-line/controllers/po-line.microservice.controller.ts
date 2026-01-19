import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PoLineService } from '../services/po-line.service';
import { PoLineQueryDto } from '../dtos/po-line.dtos';

@Controller()
export class PoLineMicroserviceController {
  constructor(private readonly poLineService: PoLineService) {}

  @MessagePattern('po-line.findAll')
  async findAll(@Payload() queryDto: PoLineQueryDto) {
    return this.poLineService.findAllPoLines(queryDto);
  }

  @MessagePattern('po-line.findById')
  async findById(@Payload() data: { poLineId: number; vendorId: number }) {
    return this.poLineService.findPoLineById(data.poLineId, data.vendorId);
  }

  @MessagePattern('po-line.count')
  async count(@Payload() queryDto: PoLineQueryDto) {
    return this.poLineService.getPoLineCount(queryDto);
  }
}
