import { Module } from '@nestjs/common';
import { ArCustomersSdController } from './controllers/ar-customers-sd.controller';
import { ArCustomersSdMicroserviceController } from './controllers/ar-customers-sd.microservice.controller';
import { ArCustomersSdService } from './services/ar-customers-sd.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [
    ArCustomersSdController,
    ArCustomersSdMicroserviceController,
  ],
  providers: [ArCustomersSdService],
  exports: [ArCustomersSdService],
})
export class ArCustomersSdModule {}

