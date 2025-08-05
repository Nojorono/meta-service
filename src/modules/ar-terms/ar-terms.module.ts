import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ArTermsService } from './services/ar-terms.service';
import { ArTermsMicroserviceController } from './controllers/ar-terms.microservice.controllers';
import { ArTermsController } from './controllers/ar-terms.controller';

@Module({
  imports: [CommonModule],
  controllers: [ArTermsMicroserviceController, ArTermsController],
  providers: [ArTermsService],
  exports: [ArTermsService],
})
export class ArTermsModule {}
