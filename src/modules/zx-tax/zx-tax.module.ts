import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { ZxTaxController, ZxTaxMicroserviceController } from './controllers';
import { ZxTaxService } from './services/zx-tax.service';

@Module({
  imports: [CommonModule],
  controllers: [ZxTaxController, ZxTaxMicroserviceController],
  providers: [ZxTaxService],
  exports: [ZxTaxService],
})
export class ZxTaxModule {}
