import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { FpprSalesTypesService } from './services/fppr-sales-types.service';
import { FpprSalesTypesMicroserviceController } from './controllers/fppr-sales-types.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [FpprSalesTypesMicroserviceController],
  providers: [FpprSalesTypesService],
  exports: [FpprSalesTypesService],
})
export class FpprSalesTypesModule {}
