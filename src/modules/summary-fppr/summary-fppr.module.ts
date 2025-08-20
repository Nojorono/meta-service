import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import {
  SummaryFpprController,
  SummaryFpprMicroserviceController,
} from './controllers';
import { SummaryFpprService } from './services/summary-fppr.service';

@Module({
  imports: [CommonModule],
  controllers: [SummaryFpprController, SummaryFpprMicroserviceController],
  providers: [SummaryFpprService],
  exports: [SummaryFpprService],
})
export class SummaryFpprModule {}
