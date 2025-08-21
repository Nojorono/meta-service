import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from '../../../common/decorators/internal.decorator';
import { ZxTaxService } from '../services/zx-tax.service';
import { ZxTaxQueryDto } from '../dtos/zx-tax.dtos';

@Controller()
@Internal()
export class ZxTaxMicroserviceController {
  constructor(private readonly zxTaxService: ZxTaxService) {}

  @MessagePattern('zx_tax.findAll')
  async findAllMicroservice(@Payload() query: ZxTaxQueryDto) {
    try {
      const data = await this.zxTaxService.findAllZxTaxes(query);
      const total = await this.zxTaxService.countZxTaxes(query);
      return { data, total };
    } catch (error) {
      throw error;
    }
  }

  @MessagePattern('zx_tax.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.zxTaxService.findZxTaxById(data.id);
    } catch (error) {
      throw error;
    }
  }
}
