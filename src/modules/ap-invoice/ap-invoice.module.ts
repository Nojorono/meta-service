import { Module } from '@nestjs/common';
import { ApInvoiceController } from './controllers/ap-invoice.controller';
import { ApInvoiceMicroserviceController } from './controllers/ap-invoice.microservice.controller';
import { ApInvoiceService } from './services/ap-invoice.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [CommonModule],
    controllers: [ApInvoiceController, ApInvoiceMicroserviceController],
    providers: [ApInvoiceService],
    exports: [ApInvoiceService],
})
export class ApInvoiceModule { }
