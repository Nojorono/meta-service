import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { RcvReceiptController } from './controllers/rcv-receipt.controller';
import { RcvReceiptMicroserviceController } from './controllers/rcv-receipt.microservice.controller';
import { RcvReceiptService } from './services/rcv-receipt.service';
import { RcvReceiptHeaderService } from './services/rcv-receipt-header.service';
import { RcvReceiptLinesService } from './services/rcv-receipt-lines.service';

@Module({
  imports: [CommonModule],
  controllers: [RcvReceiptController, RcvReceiptMicroserviceController],
  providers: [RcvReceiptService, RcvReceiptHeaderService, RcvReceiptLinesService],
  exports: [RcvReceiptService],
})
export class RcvReceiptModule {}
