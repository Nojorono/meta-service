import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MoveOrderWmsController } from './controllers/move-order-wms.controller';
import { MoveOrderWmsMicroserviceController } from './controllers/move-order-wms.microservice.controller';
import { MoveOrderWmsService } from './services/move-order-wms.service';
import { MoveOrderWmsHeaderService } from './services/move-order-wms-header.service';
import { MoveOrderWmsLinesService } from './services/move-order-wms-lines.service';

@Module({
  imports: [CommonModule],
  controllers: [MoveOrderWmsController, MoveOrderWmsMicroserviceController],
  providers: [
    MoveOrderWmsService,
    MoveOrderWmsHeaderService,
    MoveOrderWmsLinesService,
  ],
  exports: [MoveOrderWmsService],
})
export class MoveOrderWmsModule {}
