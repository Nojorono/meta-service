import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ApInvoiceTypesService } from './services/ap-invoice-types.service';
import { ApInvoiceTypesMicroserviceController } from './controllers/ap-invoice-types.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [ApInvoiceTypesMicroserviceController],
  providers: [ApInvoiceTypesService],
  exports: [ApInvoiceTypesService],
})
export class ApInvoiceTypesModule {}
