import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ArOutstandingsService } from './services/ar-outstandings.service';
import { ArOutstandingsMicroserviceController } from './controllers/ar-outstandings.microservice.controllers';
import { ArOutstandingsController } from './controllers/ar-outstandings.controller';

@Module({
  imports: [CommonModule],
  controllers: [ArOutstandingsMicroserviceController, ArOutstandingsController],
  providers: [ArOutstandingsService],
  exports: [ArOutstandingsService],
})
export class ArOutstandingsModule {}
