import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { SalesOrderService } from './services/sales-order.service';
import { SalesOrderController } from './controllers/sales-order.controller';

@Module({
  imports: [CommonModule],
  controllers: [SalesOrderController],
  providers: [SalesOrderService],
  exports: [SalesOrderService],
})
export class SalesOrderModule {}
