import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { SalesOrderStockService } from './services/sales-order-stock.service';
import { SalesOrderStockMicroserviceController } from './controllers/sales-order-stock.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [SalesOrderStockMicroserviceController],
  providers: [SalesOrderStockService],
  exports: [SalesOrderStockService],
})
export class SalesOrderStockModule {}
