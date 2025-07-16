import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { CoaExpenseController } from './controllers/coa-expense.controller';
import { CoaExpenseService } from './services/coa-expense.service';

@Module({
  imports: [CommonModule],
  controllers: [CoaExpenseController],
  providers: [CoaExpenseService],
  exports: [CoaExpenseService],
})
export class CoaExpenseModule {}
