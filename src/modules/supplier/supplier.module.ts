import { Module } from '@nestjs/common';
import { SupplierController } from './controllers/supplier.controller';
import { SupplierMicroserviceController } from './controllers/supplier.microservice.controller';
import { SupplierService } from './services/supplier.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [SupplierController, SupplierMicroserviceController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierMetaModule {}
