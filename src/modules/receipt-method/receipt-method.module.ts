import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import {
  ReceiptMethodController,
  ReceiptMethodMicroserviceController,
} from './controllers';
import { ReceiptMethodService } from './services/receipt-method.service';

@Module({
  imports: [CommonModule],
  controllers: [ReceiptMethodController, ReceiptMethodMicroserviceController],
  providers: [ReceiptMethodService],
  exports: [ReceiptMethodService],
})
export class ReceiptMethodModule {}
