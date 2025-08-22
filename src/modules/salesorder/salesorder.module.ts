import { Module } from '@nestjs/common';
import { SalesOrderController } from './controllers/salesorder.controller';
import { SalesOrderMicroserviceController } from './controllers/salesorder.microservice.controller';
import { SalesOrderService } from './services/salesorder.service';
import { OracleService } from 'src/common/services/oracle.service';

@Module({
  controllers: [SalesOrderController, SalesOrderMicroserviceController],
  providers: [SalesOrderService, OracleService],
  exports: [SalesOrderService],
})
export class SalesOrderModule { }
