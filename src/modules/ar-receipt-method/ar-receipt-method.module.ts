import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import {
  ArReceiptMethodController,
  ArReceiptMethodMicroserviceController,
} from './controllers';
import { ArReceiptMethodService } from './services/ar-receipt-method.service';

@Module({
  imports: [CommonModule],
  controllers: [
    ArReceiptMethodController,
    ArReceiptMethodMicroserviceController,
  ],
  providers: [ArReceiptMethodService],
  exports: [ArReceiptMethodService],
})
export class ArReceiptMethodModule {}
