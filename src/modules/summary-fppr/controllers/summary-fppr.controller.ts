import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';
import { SummaryFpprService } from '../services/summary-fppr.service';
import { SummaryFpprDto, SummaryFpprQueryDto } from '../dtos/summary-fppr.dtos';

@ApiTags('Summary FPPR')
@Controller('summary-fppr')
@AuthSwagger()
export class SummaryFpprController {
  constructor(private readonly summaryFpprService: SummaryFpprService) {}

  @Get()
  @ApiOperation({ summary: 'Get all summary FPPR records' })
  @ApiResponse({
    status: 200,
    description: 'Summary FPPR records retrieved successfully',
    type: [SummaryFpprDto],
  })
  @ApiQuery({
    name: 'SUMMARY_ID',
    required: false,
    description: 'Filter by summary ID',
  })
  @ApiQuery({
    name: 'FPPR_ID',
    required: false,
    description: 'Filter by FPPR ID',
  })
  @ApiQuery({
    name: 'FPPR_NUMBER',
    required: false,
    description: 'Filter by FPPR number',
  })
  @ApiQuery({
    name: 'DESCRIPTION',
    required: false,
    description: 'Filter by description',
  })
  @ApiQuery({
    name: 'SOURCE_SYSTEM',
    required: false,
    description: 'Filter by source system',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: SummaryFpprQueryDto): Promise<any> {
    try {
      const data = await this.summaryFpprService.findAllSummaryFpprs(query);
      const total = await this.summaryFpprService.countSummaryFpprs(query);

      return {
        success: true,
        statusCode: 200,
        message: 'Summary FPPR records retrieved successfully',
        data,
        pagination: {
          total,
          page: query.page || 1,
          limit: query.limit || 10,
          totalPages: Math.ceil(total / (query.limit || 10)),
        },
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve summary FPPR records',
        error: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a summary FPPR record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Summary FPPR record retrieved successfully',
    type: SummaryFpprDto,
  })
  @ApiResponse({ status: 404, description: 'Summary FPPR record not found' })
  @ApiParam({
    name: 'id',
    description: 'Summary ID',
    example: '2',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result = await this.summaryFpprService.findSummaryFpprById(id);

      if (!result) {
        return {
          success: false,
          statusCode: 404,
          message: 'Summary FPPR record not found',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Summary FPPR record retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve summary FPPR record',
        error: error.message,
      };
    }
  }
}
