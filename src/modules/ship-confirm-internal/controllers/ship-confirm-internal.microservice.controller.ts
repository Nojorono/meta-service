import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from 'src/common/decorators/internal.decorator';
import {
  CreateShipConfirmInternalDto,
  ShipConfirmInternalResponseDto,
} from '../dtos/ship-confirm-internal.dtos';
import { ShipConfirmInternalService } from '../services/ship-confirm-internal.service';

@Controller()
export class ShipConfirmInternalMicroserviceController {
  constructor(
    private readonly shipConfirmInternalService: ShipConfirmInternalService,
  ) {}

  @MessagePattern('ship-confirm-internal.create')
  @Internal()
  async create(
    @Payload()
    payload: CreateShipConfirmInternalDto | CreateShipConfirmInternalDto[],
  ): Promise<ShipConfirmInternalResponseDto> {
    const list = Array.isArray(payload) ? payload : [payload];
    return this.shipConfirmInternalService.create(list);
  }
}
