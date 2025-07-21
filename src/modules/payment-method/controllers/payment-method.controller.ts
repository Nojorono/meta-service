import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PaymentMethodService } from '../services/payment-method.service';
import {
  PaymentMethodDto,
  PaymentMethodQueryDto,
} from '../dtos/payment-method.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Payment Method')
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Get()
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Return all payment methods',
    type: [PaymentMethodDto],
  })
  @ApiQuery({
    name: 'paymentMethodName',
    required: false,
    description: 'Filter by payment method name',
  })
  @ApiQuery({
    name: 'paymentMethodCode',
    required: false,
    description: 'Filter by payment method code',
  })
  @ApiQuery({
    name: 'paymentTypeLookupCode',
    required: false,
    description: 'Filter by payment type lookup code',
  })
  @ApiQuery({
    name: 'organizationCode',
    required: false,
    description: 'Filter by organization code',
  })
  @ApiQuery({
    name: 'enabledFlag',
    required: false,
    description: 'Filter by enabled flag',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: PaymentMethodQueryDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page = 1, limit = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.paymentMethodService.findAllPaymentMethods(query),
      this.paymentMethodService.countPaymentMethods(query),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Payment methods retrieved successfully',
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get payment methods by name' })
  @ApiParam({ name: 'name', description: 'Payment method name' })
  @ApiResponse({
    status: 200,
    description: 'Return payment methods with the specified name',
    type: [PaymentMethodDto],
  })
  async findByName(@Param('name') name: string): Promise<any> {
    const data = await this.paymentMethodService.findAllPaymentMethods({
      paymentMethodName: name,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Payment methods retrieved successfully',
      data,
    };
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get payment methods by code' })
  @ApiParam({ name: 'code', description: 'Payment method code' })
  @ApiResponse({
    status: 200,
    description: 'Return payment methods with the specified code',
    type: [PaymentMethodDto],
  })
  async findByCode(@Param('code') code: string): Promise<any> {
    const data = await this.paymentMethodService.findAllPaymentMethods({
      paymentMethodCode: code,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Payment methods retrieved successfully',
      data,
    };
  }

  // Microservice endpoints
  @MessagePattern('payment-method.findAll')
  async findAllMicroservice(
    @Payload() query: PaymentMethodQueryDto,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page = 1, limit = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.paymentMethodService.findAllPaymentMethods(query),
      this.paymentMethodService.countPaymentMethods(query),
    ]);

    return {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  @MessagePattern('payment-method.findByName')
  async findByNameMicroservice(
    @Payload() name: string,
  ): Promise<PaymentMethodDto[]> {
    return await this.paymentMethodService.findAllPaymentMethods({
      paymentMethodName: name,
    });
  }

  @MessagePattern('payment-method.findByCode')
  async findByCodeMicroservice(
    @Payload() code: string,
  ): Promise<PaymentMethodDto[]> {
    return await this.paymentMethodService.findAllPaymentMethods({
      paymentMethodCode: code,
    });
  }
}
