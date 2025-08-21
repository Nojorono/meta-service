import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MoveOrderController, MoveOrderMicroserviceController } from './controllers';
import { MoveOrderService } from './services/move-order.service';

@Module({
    imports: [CommonModule],
    controllers: [MoveOrderController, MoveOrderMicroserviceController],
    providers: [MoveOrderService],
    exports: [MoveOrderService],
})
export class MoveOrderModule { }
