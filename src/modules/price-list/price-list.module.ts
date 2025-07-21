import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PriceListService } from './services/price-list.service';
import { PriceListController } from './controllers/price-list.controller';
import { PriceListMicroserviceController } from './controllers/price-list.microservice.controller';

@Module({
  imports: [CommonModule],
  controllers: [PriceListController, PriceListMicroserviceController],
  providers: [PriceListService],
  exports: [PriceListService],
})
export class PriceListModule {}
