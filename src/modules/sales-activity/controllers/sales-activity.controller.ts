import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SalesActivityService } from '../services/sales-activity.service';
import {
  SalesActivityDto,
  SalesActivityQueryDto,
} from '../dtos/sales-activity.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Sales Activity')
@Controller('sales-activity')
export class SalesActivityController {
  constructor(private readonly salesActivityService: SalesActivityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all sales activities' })
  @ApiResponse({
    status: 200,
    description: 'Return all sales activities',
    type: [SalesActivityDto],
  })
  @ApiQuery({
    name: 'activityName',
    required: false,
    description: 'Filter by activity name',
  })
  @ApiQuery({
    name: 'receiptTypeDms',
    required: false,
    description: 'Filter by receipt type DMS',
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
  async findAll(@Query() query: SalesActivityQueryDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page = 1, limit = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.salesActivityService.findAllSalesActivities(query),
      this.salesActivityService.countSalesActivities(query),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Sales activities retrieved successfully',
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sales activity by ID' })
  @ApiParam({ name: 'id', description: 'Sales activity ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the sales activity',
    type: SalesActivityDto,
  })
  async findById(@Param('id') id: number): Promise<any> {
    const data = await this.salesActivityService.findSalesActivityById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Sales activity retrieved successfully',
      data,
    };
  }

  // Microservice endpoints
  @MessagePattern('sales-activity.findAll')
  async findAllMicroservice(
    @Payload() query: SalesActivityQueryDto,
  ): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page = 1, limit = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.salesActivityService.findAllSalesActivities(query),
      this.salesActivityService.countSalesActivities(query),
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

  @MessagePattern('sales-activity.findById')
  async findByIdMicroservice(@Payload() id: number): Promise<SalesActivityDto> {
    return await this.salesActivityService.findSalesActivityById(id);
  }
}
