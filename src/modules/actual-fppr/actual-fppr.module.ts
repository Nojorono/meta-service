import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import {
  ActualFpprController,
  ActualFpprMicroserviceController,
} from './controllers';
import { ActualFpprService } from './services/actual-fppr.service';

@Module({
  imports: [CommonModule],
  controllers: [ActualFpprController, ActualFpprMicroserviceController],
  providers: [ActualFpprService],
  exports: [ActualFpprService],
})
export class ActualFpprModule {}
