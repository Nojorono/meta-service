import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { PoInternalReqController } from './controllers/po-internal-req.controller';
import { PoInternalReqMicroserviceController } from './controllers/po-internal-req.microservice.controller';
import { PoInternalReqService } from './services/po-internal-req.service';
import { PoInternalReqHeaderService } from './services/po-internal-req-header.service';
import { PoInternalReqLinesService } from './services/po-internal-req-lines.service';

@Module({
  imports: [CommonModule],
  controllers: [PoInternalReqController, PoInternalReqMicroserviceController],
  providers: [
    PoInternalReqService,
    PoInternalReqHeaderService,
    PoInternalReqLinesService,
  ],
  exports: [PoInternalReqService],
})
export class PoInternalReqModule {}
