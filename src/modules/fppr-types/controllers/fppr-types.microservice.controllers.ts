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
import { FpprTypesService } from '../services/fppr-types.service';
import { FpprTypesDto, FpprTypesQueryDto } from '../dtos/fppr-types.dtos';

@ApiTags('FPPR Types')
@Controller('fppr-types')
@AuthSwagger()
export class FpprTypesMicroserviceController {
  constructor(private readonly fpprTypesService: FpprTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all FPPR types' })
  @ApiResponse({
    status: 200,
    description: 'FPPR types retrieved successfully',
    type: [FpprTypesDto],
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
    name: 'FPPR_TYPE_CODE',
    required: false,
    type: String,
    description: 'FPPR type',
  })
  @ApiQuery({
    name: 'DESCRIPTION',
    required: false,
    type: String,
    description: 'Description FPPR',
  })
  @ApiQuery({
    name: 'ENABLED_FLAG',
    required: false,
    type: String,
    description: 'Enabled flag',
  })
  async findAll(@Query() query: FpprTypesQueryDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page = 1, limit = 10, ..._filters } = query;

      const [data, total] = await Promise.all([
        this.fpprTypesService.findAllFpprTypes(query),
        this.fpprTypesService.countFpprTypes(query),
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
          message: 'Failed to retrieve FPPR types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get FPPR type by code' })
  @ApiResponse({
    status: 200,
    description: 'FPPR type retrieved successfully',
    type: FpprTypesDto,
  })
  @ApiResponse({ status: 404, description: 'FPPR type not found' })
  async findOne(@Param('code') code: string) {
    try {
      const result = await this.fpprTypesService.findFpprTypeByCode(code);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'FPPR type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('fppr_types.findAll')
  async findAllMicroservice(@Payload() query: FpprTypesQueryDto) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { page = 1, limit = 10, ..._filters } = query;

      const [data, total] = await Promise.all([
        this.fpprTypesService.findAllFpprTypes(query),
        this.fpprTypesService.countFpprTypes(query),
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
          message: 'Failed to retrieve FPPR types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('fppr_types.findOne')
  async findOneMicroservice(@Payload() data: { code: string }) {
    try {
      return await this.fpprTypesService.findFpprTypeByCode(data.code);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'FPPR type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
