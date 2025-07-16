import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ApTermsService } from './services/ap-terms.service';
import { ApTermsMicroserviceController } from './controllers/ap-terms.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [ApTermsMicroserviceController],
  providers: [ApTermsService],
  exports: [ApTermsService],
})
export class ApTermsModule {}
