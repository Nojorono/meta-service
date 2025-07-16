import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { SalesActivityController } from './controllers/sales-activity.controller';
import { SalesActivityService } from './services/sales-activity.service';

@Module({
  imports: [CommonModule],
  controllers: [SalesActivityController],
  providers: [SalesActivityService],
  exports: [SalesActivityService],
})
export class SalesActivityModule {}
