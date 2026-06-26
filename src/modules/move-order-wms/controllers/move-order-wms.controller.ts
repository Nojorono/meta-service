import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import {
  CreateMoveOrderWmsDto,
  MoveOrderWmsResponseDto,
} from '../dtos/move-order-wms.dtos';
import { MoveOrderWmsService } from '../services/move-order-wms.service';

@ApiTags('Move Order WMS Interface')
@Public()
@AuthSwagger()
@Controller('move-order-wms')
export class MoveOrderWmsController {
  constructor(private readonly moveOrderWmsService: MoveOrderWmsService) {}

  @Post()
  @ApiBody({ type: [CreateMoveOrderWmsDto] })
  @ApiOperation({
    summary: 'Insert one or more move order WMS interface records',
  })
  @ApiResponse({
    status: 201,
    description: 'Move order WMS interface data inserted successfully',
    type: MoveOrderWmsResponseDto,
  })
  async create(
    @Body(new ParseArrayPipe({ items: CreateMoveOrderWmsDto }))
    payload: CreateMoveOrderWmsDto[],
  ): Promise<MoveOrderWmsResponseDto> {
    return this.moveOrderWmsService.create(payload);
  }

  @Get(':source_header_id')
  @ApiOperation({
    summary: 'Get move order WMS interface data by source header id',
  })
  @ApiResponse({
    status: 200,
    description: 'Move order WMS interface data retrieved successfully',
    type: MoveOrderWmsResponseDto,
  })
  async getBySourceHeaderId(
    @Param('source_header_id') sourceHeaderId: string,
  ): Promise<MoveOrderWmsResponseDto> {
    return this.moveOrderWmsService.getBySourceHeaderId(sourceHeaderId);
  }
}
