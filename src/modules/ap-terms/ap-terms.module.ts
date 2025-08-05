import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ApTermsService } from './services/ap-terms.service';
import { ApTermsMicroserviceController } from './controllers/ap-terms.microservice.controllers';
import { ApTermsController } from './controllers/ap-terms.controller';

@Module({
  imports: [CommonModule],
  controllers: [ApTermsMicroserviceController, ApTermsController],
  providers: [ApTermsService],
  exports: [ApTermsService],
})
export class ApTermsModule {}
