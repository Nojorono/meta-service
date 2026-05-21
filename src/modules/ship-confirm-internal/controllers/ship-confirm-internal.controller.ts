import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import {
  CreateShipConfirmInternalDto,
  ShipConfirmInternalResponseDto,
} from '../dtos/ship-confirm-internal.dtos';
import { ShipConfirmInternalService } from '../services/ship-confirm-internal.service';

@ApiTags('Ship Confirm Internal Interface')
@Public()
@AuthSwagger()
@Controller('ship-confirm-internal')
export class ShipConfirmInternalController {
  constructor(
    private readonly shipConfirmInternalService: ShipConfirmInternalService,
  ) {}

  @Post()
  @ApiBody({ type: [CreateShipConfirmInternalDto] })
  @ApiOperation({
    summary: 'Insert one or more ship confirm internal interface records',
    description:
      'Supports TRANSACTION_TYPE: Outbound GS Mutasi SO Internal, Outbound GS SO Subdist Pick Release (with LINES), Outbound GS SO Subdist Ship Confirm',
  })
  @ApiResponse({
    status: 201,
    description: 'Ship confirm internal interface data inserted successfully',
    type: ShipConfirmInternalResponseDto,
  })
  async create(
    @Body(new ParseArrayPipe({ items: CreateShipConfirmInternalDto }))
    payload: CreateShipConfirmInternalDto[],
  ): Promise<ShipConfirmInternalResponseDto> {
    return this.shipConfirmInternalService.create(payload);
  }
}
