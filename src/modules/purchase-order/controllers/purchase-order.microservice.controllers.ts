import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
export class PurchaseOrderMicroserviceController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @MessagePattern('purchase-order.findByNomorPO')
  @Internal()
  async findByNomorPO(@Payload() data: { nomorPO: string }) {
    try {
      return await this.purchaseOrderService.findByNomorPO(data.nomorPO);
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
