import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import {
  CurrencyController,
  CurrencyMicroserviceController,
} from './controllers';
import { CurrencyService } from './services/currency.service';

@Module({
  imports: [CommonModule],
  controllers: [CurrencyController, CurrencyMicroserviceController],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
