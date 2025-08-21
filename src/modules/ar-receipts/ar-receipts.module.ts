import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ArReceiptsController, ArReceiptsMicroserviceController } from './controllers';
import { ArReceiptsService } from './services/ar-receipts.service';

@Module({
    imports: [CommonModule],
    controllers: [ArReceiptsController, ArReceiptsMicroserviceController],
    providers: [ArReceiptsService],
    exports: [ArReceiptsService],
})
export class ArReceiptsModule { }
