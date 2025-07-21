import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ArOutstandingsService } from './services/ar-outstandings.service';
import { ArOutstandingsMicroserviceController } from './controllers/ar-outstandings.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [ArOutstandingsMicroserviceController],
  providers: [ArOutstandingsService],
  exports: [ArOutstandingsService],
})
export class ArOutstandingsModule {}
