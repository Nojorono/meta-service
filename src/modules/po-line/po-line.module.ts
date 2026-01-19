import { Module } from '@nestjs/common';
import { PoLineController, PoLineMicroserviceController } from './controllers';
import { PoLineService } from './services/po-line.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [PoLineController, PoLineMicroserviceController],
  providers: [PoLineService],
  exports: [PoLineService],
})
export class PoLineModule {}
