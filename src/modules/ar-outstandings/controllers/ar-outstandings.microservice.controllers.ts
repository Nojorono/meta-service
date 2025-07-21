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
import { ArOutstandingsService } from '../services/ar-outstandings.service';
import {
  ArOutstandingsDto,
  ArOutstandingsQueryDto,
} from '../dtos/ar-outstandings.dtos';

@ApiTags('AR Outstandings')
@Controller('ar-outstandings')
export class ArOutstandingsMicroserviceController {
  constructor(private readonly arOutstandingsService: ArOutstandingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all AR outstandings' })
  @ApiResponse({
    status: 200,
    description: 'AR outstandings retrieved successfully',
    type: [ArOutstandingsDto],
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
    name: 'CUSTOMER_ID',
    required: false,
    type: Number,
    description: 'Customer ID',
  })
  @ApiQuery({
    name: 'CUSTOMER_NUMBER',
    required: false,
    type: String,
    description: 'Customer number',
  })
  @ApiQuery({
    name: 'CUSTOMER_NAME',
    required: false,
    type: String,
    description: 'Customer name',
  })
  @ApiQuery({
    name: 'INVOICE_NUMBER',
    required: false,
    type: String,
    description: 'Invoice number',
  })
  @ApiQuery({
    name: 'CURRENCY_CODE',
    required: false,
    type: String,
    description: 'Currency code',
  })
  @ApiQuery({
    name: 'STATUS',
    required: false,
    type: String,
    description: 'Status',
  })
  async findAll(@Query() query: ArOutstandingsQueryDto) {
    try {
      const [data, total] = await Promise.all([
        this.arOutstandingsService.findAll(query),
        this.arOutstandingsService.countArOutstandings(query),
      ]);
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
          message: 'Failed to retrieve AR outstandings',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AR outstanding by ID' })
  @ApiResponse({
    status: 200,
    description: 'AR outstanding retrieved successfully',
    type: ArOutstandingsDto,
  })
  @ApiResponse({ status: 404, description: 'AR outstanding not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.arOutstandingsService.findOne(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AR outstanding not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('ar_outstandings.findAll')
  async findAllMicroservice(@Payload() query: ArOutstandingsQueryDto) {
    try {
      const [data, total] = await Promise.all([
        this.arOutstandingsService.findAll(query),
        this.arOutstandingsService.countArOutstandings(query),
      ]);
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
          message: 'Failed to retrieve AR outstandings',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('ar_outstandings.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.arOutstandingsService.findOne(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AR outstanding not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
