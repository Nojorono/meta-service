import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import {
  CreateRcvReceiptDto,
  RcvReceiptResponseDto,
} from '../dtos/rcv-receipt.dtos';
import { RcvReceiptService } from '../services/rcv-receipt.service';

@ApiTags('RCV Receipt Header Interface')
@Public()
@AuthSwagger()
@Controller('rcv-receipt')
export class RcvReceiptController {
  constructor(private readonly rcvReceiptService: RcvReceiptService) {}

  @Post()
  @ApiOperation({
    summary: 'Insert receipt header interface record',
  })
  @ApiResponse({
    status: 201,
    description: 'Receipt header interface data inserted successfully',
    type: RcvReceiptResponseDto,
  })
  async create(
    @Body() payload: CreateRcvReceiptDto,
  ): Promise<RcvReceiptResponseDto> {
    return this.rcvReceiptService.create(payload);
  }
}
