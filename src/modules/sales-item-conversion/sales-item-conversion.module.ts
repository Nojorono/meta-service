import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { SalesItemConversionController } from './controllers/sales-item-conversion.controller';
import { SalesItemConversionMicroserviceController } from './controllers/sales-item-conversion.microservice.controller';
import { SalesItemConversionService } from './services/sales-item-conversion.service';

@Module({
  imports: [CommonModule],
  controllers: [
    SalesItemConversionController,
    SalesItemConversionMicroserviceController,
  ],
  providers: [SalesItemConversionService],
  exports: [SalesItemConversionService],
})
export class SalesItemConversionModule {}
