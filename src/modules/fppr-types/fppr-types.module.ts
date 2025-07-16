import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { FpprTypesService } from './services/fppr-types.service';
import { FpprTypesMicroserviceController } from './controllers/fppr-types.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [FpprTypesMicroserviceController],
  providers: [FpprTypesService],
  exports: [FpprTypesService],
})
export class FpprTypesModule {}
