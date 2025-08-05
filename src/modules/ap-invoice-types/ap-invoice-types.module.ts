import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ApInvoiceTypesService } from './services/ap-invoice-types.service';
import { ApInvoiceTypesMicroserviceController } from './controllers/ap-invoice-types.microservice.controllers';
import { ApInvoiceTypesController } from './controllers/ap-invoice-types.controller';

@Module({
  imports: [CommonModule],
  controllers: [ApInvoiceTypesMicroserviceController, ApInvoiceTypesController],
  providers: [ApInvoiceTypesService],
  exports: [ApInvoiceTypesService],
})
export class ApInvoiceTypesModule {}
