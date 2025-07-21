import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PurchaseOrderService } from './services/purchase-order.service';
import { PurchaseOrderController } from './controllers/purchase-order.controller';
import { PurchaseOrderMicroserviceController } from './controllers/purchase-order.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [PurchaseOrderController, PurchaseOrderMicroserviceController],
  providers: [PurchaseOrderService],
  exports: [PurchaseOrderService],
})
export class PurchaseOrderModule {}
