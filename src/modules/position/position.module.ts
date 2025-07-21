import { Module } from '@nestjs/common';
import { PositionController } from './controllers/position.controller';
import { PositionMicroserviceController } from './controllers/position.microservice.controller';
import { PositionService } from './services/position.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [PositionController, PositionMicroserviceController],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionMetaModule {}
