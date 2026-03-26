import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrderResponseDto } from '../dtos/purchase-order.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Purchase Order')
@Public()
@AuthSwagger()
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get Purchase Order by Nomor PO' })
  @ApiResponse({
    status: 200,
    description: 'Purchase Order retrieved successfully',
    type: PurchaseOrderResponseDto,
  })
  @ApiQuery({
    name: 'nomorPO',
    required: true,
    type: String,
    description: 'Nomor PO',
  })
  async findByNomorPO(
    @Query('nomorPO') NOMOR_PO: string,
  ): Promise<PurchaseOrderResponseDto> {
    return this.purchaseOrderService.findByNomorPO(NOMOR_PO);
  }
}
