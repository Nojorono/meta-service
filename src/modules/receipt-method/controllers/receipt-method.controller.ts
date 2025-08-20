import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ReceiptMethodService } from '../services/receipt-method.service';
import {
  ReceiptMethodDto,
  ReceiptMethodQueryDto,
} from '../dtos/receipt-method.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('Receipt Method')
@Controller('receipt-method')
@AuthSwagger()
export class ReceiptMethodController {
  private readonly logger = new Logger(ReceiptMethodController.name);

  constructor(private readonly receiptMethodService: ReceiptMethodService) {}

  @Get()
  @ApiOperation({ summary: 'Get all receipt methods' })
  @ApiResponse({
    status: 200,
    description: 'Return all receipt methods',
    type: [ReceiptMethodDto],
  })
  @ApiQuery({
    name: 'receiptMethodName',
    required: false,
    description: 'Filter by receipt method name',
  })
  @ApiQuery({
    name: 'receiptClasses',
    required: false,
    description: 'Filter by receipt classes',
  })
  @ApiQuery({
    name: 'organizationCode',
    required: false,
    description: 'Filter by organization code',
  })
  @ApiQuery({
    name: 'currencyCode',
    required: false,
    description: 'Filter by currency code',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: ReceiptMethodQueryDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page = 1, limit = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.receiptMethodService.findAllReceiptMethods(query),
      this.receiptMethodService.countReceiptMethods(query),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Receipt methods retrieved successfully',
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
  @ApiOperation({ summary: 'Get receipt methods by name' })
  @ApiParam({ name: 'name', description: 'Receipt method name' })
  @ApiResponse({
    status: 200,
    description: 'Return receipt methods with the specified name',
    type: [ReceiptMethodDto],
  })
  async findByName(@Param('name') name: string): Promise<any> {
    const data = await this.receiptMethodService.findAllReceiptMethods({
      receiptMethodName: name,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Receipt methods retrieved successfully',
      data,
    };
  }

  @Get('classes/:receiptClasses')
  @ApiOperation({ summary: 'Get receipt methods by receipt classes' })
  @ApiParam({ name: 'receiptClasses', description: 'Receipt classes' })
  @ApiResponse({
    status: 200,
    description: 'Return receipt methods with the specified receipt classes',
    type: [ReceiptMethodDto],
  })
  async findByReceiptClasses(
    @Param('receiptClasses') receiptClasses: string,
  ): Promise<any> {
    const data = await this.receiptMethodService.findAllReceiptMethods({
      receiptClasses,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Receipt methods retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a receipt method by ID' })
  @ApiParam({ name: 'id', description: 'Receipt method ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the receipt method',
    type: ReceiptMethodDto,
  })
  async findById(@Param('id') id: number): Promise<any> {
    const data = await this.receiptMethodService.findReceiptMethodById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Receipt method retrieved successfully',
      data,
    };
  }
}
