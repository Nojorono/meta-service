import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CoaExpenseService } from '../services/coa-expense.service';
import { CoaExpenseDto, CoaExpenseQueryDto } from '../dtos/coa-expense.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('COA Expense')
@Controller('coa-expense')
export class CoaExpenseController {
  constructor(private readonly coaExpenseService: CoaExpenseService) {}

  @Get()
  @ApiOperation({ summary: 'Get all COA expenses' })
  @ApiResponse({
    status: 200,
    description: 'Return all COA expenses',
    type: [CoaExpenseDto],
  })
  @ApiQuery({ name: 'expenseName', required: false, description: 'Filter by expense name' })
  @ApiQuery({ name: 'coaCombinations', required: false, description: 'Filter by COA combinations' })
  @ApiQuery({ name: 'fpprTypeCode', required: false, description: 'Filter by FPPR type code' })
  @ApiQuery({ name: 'organizationCode', required: false, description: 'Filter by organization code' })
  @ApiQuery({ name: 'enabledFlag', required: false, description: 'Filter by enabled flag' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: CoaExpenseQueryDto): Promise<any> {
    const { page = 1, limit = 10, ...filters } = query;
    
    const [data, total] = await Promise.all([
      this.coaExpenseService.findAllCoaExpenses(query),
      this.coaExpenseService.countCoaExpenses(query)
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'COA expenses retrieved successfully',
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a COA expense by ID' })
  @ApiParam({ name: 'id', description: 'COA expense ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the COA expense',
    type: CoaExpenseDto,
  })
  async findById(@Param('id') id: number): Promise<any> {
    const data = await this.coaExpenseService.findCoaExpenseById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'COA expense retrieved successfully',
      data,
    };
  }

  // Microservice endpoints
  @MessagePattern('coa-expense.findAll')
  async findAllMicroservice(@Payload() query: CoaExpenseQueryDto): Promise<any> {
    const { page = 1, limit = 10, ...filters } = query;
    
    const [data, total] = await Promise.all([
      this.coaExpenseService.findAllCoaExpenses(query),
      this.coaExpenseService.countCoaExpenses(query)
    ]);

    return {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  @MessagePattern('coa-expense.findById')
  async findByIdMicroservice(@Payload() id: number): Promise<CoaExpenseDto> {
    return await this.coaExpenseService.findCoaExpenseById(id);
  }
}
