import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesmanMetaService } from '../services/salesman.service';
import { MetaSalesmanDtoByDate } from '../dtos/salesman.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SalesmanMicroserviceController {
  constructor(private readonly salesmanService: SalesmanMetaService) {}

  @MessagePattern('salesman.findByDate')
  async findByDate(@Payload() dto: MetaSalesmanDtoByDate) {
    return this.salesmanService.getSalesmenFromOracleByDate(dto);
  }

  @MessagePattern('salesman.findAll')
  async findAll() {
    return this.salesmanService.getSalesmenFromOracleByDate();
  }
}
