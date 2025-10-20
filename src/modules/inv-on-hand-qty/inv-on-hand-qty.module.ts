import { Module } from '@nestjs/common';
import { InvOnHandQtyController } from './controllers/inv-on-hand-qty.controller';
import { InvOnHandQtyMicroserviceController } from './controllers/inv-on-hand-qty.microservice.controller';
import { InvOnHandQtyService } from './services/inv-on-hand-qty.service';
import { CommonModule } from '../../common/common.module';

@Module({
    imports: [CommonModule],
    controllers: [InvOnHandQtyController, InvOnHandQtyMicroserviceController],
    providers: [InvOnHandQtyService],
    exports: [InvOnHandQtyService],
})
export class InvOnHandQtyModule { }
