import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SalesOrderTypesService } from './services/sales-order-types.service';
import { SalesOrderTypesController } from './controllers/sales-order-types.controller';
import { SalesOrderTypesMicroserviceController } from './controllers/sales-order-types.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [
    SalesOrderTypesController,
    SalesOrderTypesMicroserviceController,
  ],
  providers: [SalesOrderTypesService],
  exports: [SalesOrderTypesService],
})
export class SalesOrderTypesModule {}
