import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MtlTrxListsService } from './services/mtl-trx-lists.service';
import {
  MtlTrxListsController,
  MtlTrxListsMicroserviceController,
} from './controllers';

@Module({
  imports: [CommonModule],
  controllers: [MtlTrxListsController, MtlTrxListsMicroserviceController],
  providers: [MtlTrxListsService],
  exports: [MtlTrxListsService],
})
export class MtlTrxListsModule {}
