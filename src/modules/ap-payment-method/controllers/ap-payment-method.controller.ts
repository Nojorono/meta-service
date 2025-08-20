import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ApPaymentMethodService } from '../services/ap-payment-method.service';
import {
  ApPaymentMethodDto,
  ApPaymentMethodQueryDto,
} from '../dtos/ap-payment-method.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('AP Payment Method')
@Controller('ap-payment-method')
@AuthSwagger()
export class ApPaymentMethodController {
  private readonly logger = new Logger(ApPaymentMethodController.name);

  constructor(
    private readonly apPaymentMethodService: ApPaymentMethodService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiResponse({
    status: 200,
    description: 'Return all payment methods',
    type: [ApPaymentMethodDto],
  })
  @ApiQuery({
    name: 'apPaymentMethodName',
    required: false,
    description: 'Filter by payment method name',
  })
  @ApiQuery({
    name: 'apPaymentMethodCode',
    required: false,
    description: 'Filter by payment method code',
  })
  @ApiQuery({
    name: 'apPaymentTypeLookupCode',
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
  async findAll(@Query() query: ApPaymentMethodQueryDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page = 1, limit = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.apPaymentMethodService.findAllPaymentMethods(query),
      this.apPaymentMethodService.countPaymentMethods(query),
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
    type: [ApPaymentMethodDto],
  })
  async findByName(@Param('name') name: string): Promise<any> {
    const data = await this.apPaymentMethodService.findAllPaymentMethods({
      apPaymentMethodName: name,
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
    type: [ApPaymentMethodDto],
  })
  async findByCode(@Param('code') code: string): Promise<any> {
    const data = await this.apPaymentMethodService.findAllPaymentMethods({
      apPaymentMethodCode: code,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Payment methods retrieved successfully',
      data,
    };
  }
}
