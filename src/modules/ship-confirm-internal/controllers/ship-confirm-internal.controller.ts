import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import {
  CreateShipConfirmInternalDto,
  ShipConfirmInternalFindDto,
  ShipConfirmInternalResponseDto,
} from '../dtos/ship-confirm-internal.dtos';
import { ShipConfirmInternalService } from '../services/ship-confirm-internal.service';

@ApiTags('Ship Confirm Internal Interface')
@Public()
@AuthSwagger()
@Controller('ship-confirm')
export class ShipConfirmInternalController {
  constructor(
    private readonly shipConfirmInternalService: ShipConfirmInternalService,
  ) { }

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

  @Get()
  @ApiOperation({
    summary: 'Get ship confirm internal interface data',
    description:
      'Filter by source_header_id and/or iso_header_id (combined with AND). At least one is required.',
  })
  @ApiResponse({
    status: 200,
    description: 'Ship confirm internal interface data retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - at least one filter is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Ship confirm internal interface data not found',
  })
  async find(@Query() query: ShipConfirmInternalFindDto): Promise<unknown> {
    const result = await this.shipConfirmInternalService.find(query);

    if (!result.status) {
      if (result.message.startsWith('At least one of')) {
        throw new BadRequestException(result.message);
      }
      if (result.message.startsWith('No ship confirm')) {
        throw new NotFoundException(result.message);
      }
      throw new InternalServerErrorException(result.message);
    }

    return result.data;
  }
}
