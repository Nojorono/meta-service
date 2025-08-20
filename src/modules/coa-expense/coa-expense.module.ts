import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import {
  CoaExpenseController,
  CoaExpenseMicroserviceController,
} from './controllers';
import { CoaExpenseService } from './services/coa-expense.service';

@Module({
  imports: [CommonModule],
  controllers: [CoaExpenseController, CoaExpenseMicroserviceController],
  providers: [CoaExpenseService],
  exports: [CoaExpenseService],
})
export class CoaExpenseModule {}
