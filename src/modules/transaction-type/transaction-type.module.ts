import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { TransactionTypeController } from './controllers/transaction-type.controller';
import { TransactionTypeService } from './services/transaction-type.service';

@Module({
  imports: [CommonModule],
  controllers: [TransactionTypeController],
  providers: [TransactionTypeService],
  exports: [TransactionTypeService],
})
export class TransactionTypeModule {}
