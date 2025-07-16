import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MtlTrxListsService } from './services/mtl-trx-lists.service';
import { MtlTrxListsMicroserviceController } from './controllers/mtl-trx-lists.microservice.controllers';

@Module({
  imports: [
    CommonModule,
  ],
  controllers: [MtlTrxListsMicroserviceController],
  providers: [MtlTrxListsService],
  exports: [MtlTrxListsService],
})
export class MtlTrxListsModule {}
