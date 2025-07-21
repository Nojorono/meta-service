import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { SalesOrderService } from './services/sales-order.service';
import { SalesOrderController } from './controllers/sales-order.controller';
import { SalesOrderMicroserviceController } from './controllers/sales-order.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [SalesOrderController, SalesOrderMicroserviceController],
  providers: [SalesOrderService],
  exports: [SalesOrderService],
})
export class SalesOrderModule {}
