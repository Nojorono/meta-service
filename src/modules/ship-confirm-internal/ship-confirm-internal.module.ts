import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { ShipConfirmInternalController } from './controllers/ship-confirm-internal.controller';
import { ShipConfirmInternalMicroserviceController } from './controllers/ship-confirm-internal.microservice.controller';
import { ShipConfirmInternalService } from './services/ship-confirm-internal.service';
import { ShipConfirmInternalDeliveryService } from './services/ship-confirm-internal-delivery.service';

@Module({
  imports: [CommonModule],
  controllers: [
    ShipConfirmInternalController,
    ShipConfirmInternalMicroserviceController,
  ],
  providers: [
    ShipConfirmInternalService,
    ShipConfirmInternalDeliveryService,
  ],
  exports: [ShipConfirmInternalService],
})
export class ShipConfirmInternalModule {}
