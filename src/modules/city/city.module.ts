import { Module } from '@nestjs/common';
import { CityController } from './controllers/city.controller';
import { CityMicroserviceController } from './controllers/city.microservice.controller';
import { CityService } from './services/city.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [CityController, CityMicroserviceController],
  providers: [CityService],
  exports: [CityService],
})
export class CityMetaModule {}
