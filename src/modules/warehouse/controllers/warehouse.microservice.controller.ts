import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WarehouseMetaService } from '../services/warehouse.service';
import {
  MetaWarehouseDtoByDate,
  MetaWarehouseDtoByOrganizationCode,
} from '../dtos/warehouse.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class WarehouseMicroserviceController {
  constructor(private readonly warehouseService: WarehouseMetaService) {}

  @MessagePattern('warehouse.findByDate')
  async findByDate(@Payload() dto: MetaWarehouseDtoByDate) {
    return this.warehouseService.getWarehousesFromOracleByDate(dto);
  }

  @MessagePattern('warehouse.findByOrganizationCode')
  async findByOrganizationCode(
    @Payload() dto: MetaWarehouseDtoByOrganizationCode,
  ) {
    return this.warehouseService.getWarehousesFromOracleByOrganizationCode(dto);
  }

  @MessagePattern('warehouse.findAll')
  async findAll() {
    return this.warehouseService.getWarehousesFromOracleByDate();
  }
}
