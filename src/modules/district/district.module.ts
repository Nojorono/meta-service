import { Module } from '@nestjs/common';
import { DistrictController } from './controllers/district.controller';
import { DistrictMicroserviceController } from './controllers/district.microservice.controller';
import { DistrictService } from './services/district.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [DistrictController, DistrictMicroserviceController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictMetaModule {}
