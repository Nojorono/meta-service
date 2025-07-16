import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ReceiptMethodController } from './controllers/receipt-method.controller';
import { ReceiptMethodService } from './services/receipt-method.service';

@Module({
  imports: [CommonModule],
  controllers: [ReceiptMethodController],
  providers: [ReceiptMethodService],
  exports: [ReceiptMethodService],
})
export class ReceiptMethodModule {}
