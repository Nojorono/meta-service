import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PriceListService } from './services/price-list.service';
import { PriceListController } from './controllers/price-list.controller';

@Module({
  imports: [CommonModule],
  controllers: [PriceListController],
  providers: [PriceListService],
  exports: [PriceListService],
})
export class PriceListModule {}
