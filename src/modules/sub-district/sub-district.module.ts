import { Module } from '@nestjs/common';
import { SubDistrictController } from './controllers/sub-district.controller';
import { SubDistrictMicroserviceController } from './controllers/sub-district.microservice.controller';
import { SubDistrictService } from './services/sub-district.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [SubDistrictController, SubDistrictMicroserviceController],
  providers: [SubDistrictService],
  exports: [SubDistrictService],
})
export class SubDistrictMetaModule {}
