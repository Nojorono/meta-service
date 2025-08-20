import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { TransactionTypeService } from '../services/transaction-type.service';
import {
  TransactionTypeDto,
  TransactionTypeQueryDto,
} from '../dtos/transaction-type.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('Transaction Type')
@Controller('transaction-type')
@AuthSwagger()
export class TransactionTypeController {
  constructor(
    private readonly transactionTypeService: TransactionTypeService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all transaction types' })
  @ApiResponse({
    status: 200,
    description: 'Return all transaction types',
    type: [TransactionTypeDto],
  })
  @ApiQuery({
    name: 'transactionTypeName',
    required: false,
    description: 'Filter by transaction type name',
  })
  @ApiQuery({
    name: 'transactionTypeDms',
    required: false,
    description: 'Filter by transaction type DMS',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'organizationCode',
    required: false,
    description: 'Filter by organization code',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: TransactionTypeQueryDto): Promise<any> {
    const data =
      await this.transactionTypeService.findAllTransactionTypes(query);
    const total =
      await this.transactionTypeService.countTransactionTypes(query);
    return {
      success: true,
      statusCode: 200,
      message: 'Transaction types retrieved successfully',
      data,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total,
        totalPages: Math.ceil(total / (query.limit || 10)),
      },
    };
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get transaction types by name' })
  @ApiParam({ name: 'name', description: 'Transaction type name' })
  @ApiResponse({
    status: 200,
    description: 'Return transaction types with the specified name',
    type: [TransactionTypeDto],
  })
  async findByName(@Param('name') name: string): Promise<any> {
    const data = await this.transactionTypeService.findAllTransactionTypes({
      transactionTypeName: name,
    });
    return {
      success: true,
      statusCode: 200,
      message: 'Transaction types retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction type by ID' })
  @ApiParam({ name: 'id', description: 'Transaction type ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the transaction type',
    type: TransactionTypeDto,
  })
  async findById(@Param('id') id: number): Promise<any> {
    const data = await this.transactionTypeService.findTransactionTypeById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Transaction type retrieved successfully',
      data,
    };
  }

  // Microservice endpoints
  @MessagePattern('transaction-type.findAll')
  async findAllMicroservice(): Promise<TransactionTypeDto[]> {
    return await this.transactionTypeService.findAllTransactionTypes();
  }

  @MessagePattern('transaction-type.findById')
  async findByIdMicroservice(
    @Payload() id: number,
  ): Promise<TransactionTypeDto> {
    return await this.transactionTypeService.findTransactionTypeById(id);
  }

  @MessagePattern('transaction-type.findByName')
  async findByNameMicroservice(
    @Payload() name: string,
  ): Promise<TransactionTypeDto[]> {
    return await this.transactionTypeService.findAllTransactionTypes({
      transactionTypeName: name,
    });
  }
}
