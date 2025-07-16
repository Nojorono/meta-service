import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SummaryFpprService } from '../services/summary-fppr.service';
import { SummaryFpprDto, SummaryFpprQueryDto } from '../dtos/summary-fppr.dtos';

@ApiTags('Summary FPPR')
@Controller('summary-fppr')
export class SummaryFpprMicroserviceController {
  constructor(private readonly summaryFpprService: SummaryFpprService) {}

  @Get()
  @ApiOperation({ summary: 'Get all summary FPPR' })
  @ApiResponse({ status: 200, description: 'Summary FPPR retrieved successfully', type: [SummaryFpprDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'HEADER_ID', required: false, type: Number, description: 'Header ID' })
  @ApiQuery({ name: 'FPPR_NUMBER', required: false, type: String, description: 'FPPR number' })
  @ApiQuery({ name: 'FPPR_TYPE', required: false, type: String, description: 'FPPR type' })
  @ApiQuery({ name: 'FPPR_SALES_TYPE', required: false, type: String, description: 'FPPR sales type' })
  @ApiQuery({ name: 'CUSTOMER_ID', required: false, type: Number, description: 'Customer ID' })
  @ApiQuery({ name: 'CUSTOMER_NUMBER', required: false, type: String, description: 'Customer number' })
  @ApiQuery({ name: 'SALESPERSON_ID', required: false, type: Number, description: 'Salesperson ID' })
  @ApiQuery({ name: 'STATUS', required: false, type: String, description: 'Status' })
  @ApiQuery({ name: 'ORGANIZATION_ID', required: false, type: Number, description: 'Organization ID' })
  @ApiQuery({ name: 'BRANCH_ID', required: false, type: Number, description: 'Branch ID' })
  async findAll(@Query() query: SummaryFpprQueryDto) {
    try {
      const data = await this.summaryFpprService.findAllSummaryFppr(query);
      const total = await this.summaryFpprService.countSummaryFppr(query);
      return {
        success: true,
        data,
        total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve summary FPPR',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get summary FPPR by ID' })
  @ApiResponse({ status: 200, description: 'Summary FPPR retrieved successfully', type: SummaryFpprDto })
  @ApiResponse({ status: 404, description: 'Summary FPPR not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.summaryFpprService.findSummaryFpprById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Summary FPPR not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('summary_fppr.findAll')
  async findAllMicroservice(@Payload() query: SummaryFpprQueryDto) {
    try {
      const data = await this.summaryFpprService.findAllSummaryFppr(query);
      const total = await this.summaryFpprService.countSummaryFppr(query);
      return { data, total };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve summary FPPR',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('summary_fppr.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.summaryFpprService.findSummaryFpprById(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Summary FPPR not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
