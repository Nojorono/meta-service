import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Internal } from 'src/common/decorators/internal.decorator';
import {
  CreateShipConfirmInternalDto,
  ShipConfirmInternalFindDto,
  ShipConfirmInternalResponseDto,
} from '../dtos/ship-confirm-internal.dtos';
import { ShipConfirmInternalService } from '../services/ship-confirm-internal.service';

@Controller()
export class ShipConfirmInternalMicroserviceController {
  constructor(
    private readonly shipConfirmInternalService: ShipConfirmInternalService,
  ) { }

  @MessagePattern('shipconfirm.create')
  @Internal()
  async create(
    @Payload()
    payload: CreateShipConfirmInternalDto | CreateShipConfirmInternalDto[],
  ): Promise<ShipConfirmInternalResponseDto> {
    const list = Array.isArray(payload) ? payload : [payload];
    return this.shipConfirmInternalService.create(list);
  }

  @MessagePattern('shipconfirm.find')
  @Internal()
  async find(
    @Payload() payload: ShipConfirmInternalFindDto,
  ): Promise<ShipConfirmInternalResponseDto> {
    return this.shipConfirmInternalService.find(payload);
  }
}
