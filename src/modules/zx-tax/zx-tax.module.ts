import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ZxTaxService } from './services/zx-tax.service';
import { ZxTaxMicroserviceController } from './controllers/zx-tax.microservice.controllers';

@Module({
  imports: [CommonModule],
  controllers: [ZxTaxMicroserviceController],
  providers: [ZxTaxService],
  exports: [ZxTaxService],
})
export class ZxTaxModule {}
