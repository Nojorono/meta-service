import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PurchaseOrderService } from '../services/purchase-order.service';
import { PurchaseOrderDto } from '../dtos/purchase-order.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('Purchase Order')
@AuthSwagger()
@Controller('purchase-order')
export class PurchaseOrderController {
  constructor(private readonly purchaseOrderService: PurchaseOrderService) {}

  @Get()
  @ApiOperation({ summary: 'Get Purchase Order by Nomor PO' })
  @ApiResponse({
    status: 200,
    description: 'Purchase Order retrieved successfully',
    type: [PurchaseOrderDto],
  })
  @ApiQuery({
    name: 'nomorPO',
    required: true,
    type: String,
    description: 'Nomor PO',
  })
  async findByNomorPO(@Query('nomorPO') NOMOR_PO: string) {
    try {
      const data = await this.purchaseOrderService.findByNomorPO(NOMOR_PO);
      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve Purchase Order',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
