import { Body, Controller, ParseArrayPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import {
  CreatePoInternalReqDto,
  PoInternalReqResponseDto,
} from '../dtos/po-internal-req.dtos';
import { PoInternalReqService } from '../services/po-internal-req.service';

@ApiTags('PO Internal Req Interface')
@Public()
@AuthSwagger()
@Controller('po-internal-req')
export class PoInternalReqController {
  constructor(private readonly poInternalReqService: PoInternalReqService) {}

  @Post()
  @ApiBody({ type: [CreatePoInternalReqDto] })
  @ApiOperation({
    summary: 'Insert one or more PO internal requisition interface records',
  })
  @ApiResponse({
    status: 201,
    description: 'PO internal requisition interface data inserted successfully',
    type: PoInternalReqResponseDto,
  })
  async create(
    @Body(new ParseArrayPipe({ items: CreatePoInternalReqDto }))
    payload: CreatePoInternalReqDto[],
  ): Promise<PoInternalReqResponseDto> {
    return this.poInternalReqService.create(payload);
  }
}
