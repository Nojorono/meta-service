import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import {
  ApPaymentMethodController,
  ApPaymentMethodMicroserviceController,
} from './controllers';
import { ApPaymentMethodService } from './services/ap-payment-method.service';

@Module({
  imports: [CommonModule],
  controllers: [
    ApPaymentMethodController,
    ApPaymentMethodMicroserviceController,
  ],
  providers: [ApPaymentMethodService],
  exports: [ApPaymentMethodService],
})
export class ApPaymentMethodModule {}
