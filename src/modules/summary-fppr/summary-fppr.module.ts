import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { SummaryFpprService } from './services/summary-fppr.service';
import { SummaryFpprMicroserviceController } from './controllers/summary-fppr.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [SummaryFpprMicroserviceController],
  providers: [SummaryFpprService],
  exports: [SummaryFpprService],
})
export class SummaryFpprModule {}
