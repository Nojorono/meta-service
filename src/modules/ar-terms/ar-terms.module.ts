import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ArTermsService } from './services/ar-terms.service';
import { ArTermsMicroserviceController } from './controllers/ar-terms.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [ArTermsMicroserviceController],
  providers: [ArTermsService],
  exports: [ArTermsService],
})
export class ArTermsModule {}
