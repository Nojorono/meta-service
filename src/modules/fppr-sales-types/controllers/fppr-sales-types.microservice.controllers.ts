import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FpprSalesTypesService } from '../services/fppr-sales-types.service';
import {
  FpprSalesTypesDto,
  FpprSalesTypesQueryDto,
} from '../dtos/fppr-sales-types.dtos';

@ApiTags('FPPR Sales Types')
@Controller('fppr-sales-types')
@AuthSwagger()
export class FpprSalesTypesMicroserviceController {
  constructor(private readonly fpprSalesTypesService: FpprSalesTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all FPPR sales types' })
  @ApiResponse({
    status: 200,
    description: 'FPPR sales types retrieved successfully',
    type: [FpprSalesTypesDto],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'FPPR_SALES_TYPE_CODE',
    required: false,
    type: String,
    description: 'Lookup type',
  })
  @ApiQuery({
    name: 'DESCRIPTION',
    required: false,
    type: String,
    description: 'Lookup code',
  })
  @ApiQuery({
    name: 'ENABLED_FLAG',
    required: false,
    type: String,
    description: 'Enabled flag',
  })
  async findAll(@Query() query: FpprSalesTypesQueryDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page = 1, limit = 10, ..._filters } = query;

      const [data, total] = await Promise.all([
        this.fpprSalesTypesService.findAllFpprSalesTypes(query),
        this.fpprSalesTypesService.countFpprSalesTypes(query),
      ]);

      return {
        success: true,
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve FPPR sales types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get FPPR sales type by code' })
  @ApiResponse({
    status: 200,
    description: 'FPPR sales type retrieved successfully',
    type: FpprSalesTypesDto,
  })
  @ApiResponse({ status: 404, description: 'FPPR sales type not found' })
  async findOne(@Param('code') code: string) {
    try {
      const result =
        await this.fpprSalesTypesService.findFpprSalesTypeByCode(code);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'FPPR sales type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('fppr_sales_types.findAll')
  async findAllMicroservice(@Payload() query: FpprSalesTypesQueryDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page = 1, limit = 10, ..._filters } = query;

      const [data, total] = await Promise.all([
        this.fpprSalesTypesService.findAllFpprSalesTypes(query),
        this.fpprSalesTypesService.countFpprSalesTypes(query),
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
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve FPPR sales types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('fppr_sales_types.findOne')
  async findOneMicroservice(@Payload() data: { code: string }) {
    try {
      return await this.fpprSalesTypesService.findFpprSalesTypeByCode(
        data.code,
      );
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'FPPR sales type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
