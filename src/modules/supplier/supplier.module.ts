import { Module } from '@nestjs/common';
import { SupplierController, SupplierMicroserviceController } from './controllers';
import { SupplierService } from './services/supplier.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [SupplierController, SupplierMicroserviceController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierMetaModule {}
