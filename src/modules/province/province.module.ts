import { Module } from '@nestjs/common';
import { ProvinceController } from './controllers/province.controller';
import { ProvinceMicroserviceController } from './controllers/province.microservice.controller';
import { ProvinceService } from './services/province.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [ProvinceController, ProvinceMicroserviceController],
  providers: [ProvinceService],
  exports: [ProvinceService],
})
export class ProvinceMetaModule {}
