import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SupplierService } from '../services/supplier.service';
import { SupplierQueryDto } from '../dtos/supplier.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class SupplierMicroserviceController {
  constructor(private readonly supplierService: SupplierService) {}

  @MessagePattern('supplier.findAll')
  async findAll(@Payload() dto: SupplierQueryDto) {
    return this.supplierService.findAllSuppliers(dto);
  }

  @MessagePattern('supplier.findById')
  async findById(@Payload() dto: { supplierId: number }) {
    return this.supplierService.findSupplierById(dto.supplierId);
  }

  @MessagePattern('supplier.findByNumber')
  async findByNumber(@Payload() dto: { supplierNumber: string }) {
    return this.supplierService.findSupplierByNumber(dto.supplierNumber);
  }

  @MessagePattern('supplier.getCount')
  async getCount(@Payload() dto: SupplierQueryDto) {
    return this.supplierService.getSupplierCount(dto);
  }
}
