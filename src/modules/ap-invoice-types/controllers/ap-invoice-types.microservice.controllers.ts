import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApInvoiceTypesService } from '../services/ap-invoice-types.service';
import {
  ApInvoiceTypesDto,
  ApInvoiceTypesQueryDto,
} from '../dtos/ap-invoice-types.dtos';

@ApiTags('AP Invoice Types')
@Controller('ap-invoice-types')
export class ApInvoiceTypesMicroserviceController {
  constructor(private readonly apInvoiceTypesService: ApInvoiceTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all AP invoice types' })
  @ApiResponse({
    status: 200,
    description: 'AP invoice types retrieved successfully',
    type: [ApInvoiceTypesDto],
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
    name: 'INVOICE_TYPE_CODE',
    required: false,
    type: String,
    description: 'Invoice type lookup code',
  })
  @ApiQuery({
    name: 'INVOICE_TYPE_NAME',
    required: false,
    type: String,
    description: 'Invoice type name',
  })
  @ApiQuery({
    name: 'DESCRIPTION',
    required: false,
    type: String,
    description: 'Prepayment flag',
  })
  @ApiQuery({
    name: 'ENABLED_FLAG',
    required: false,
    type: String,
    description: 'Enabled flag',
  })
  async findAll(@Query() query: ApInvoiceTypesQueryDto) {
    try {
      const data =
        await this.apInvoiceTypesService.findAllApInvoiceTypes(query);
      const total = await this.apInvoiceTypesService.countApInvoiceTypes(query);
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
          message: 'Failed to retrieve AP invoice types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get AP invoice type by lookup code' })
  @ApiResponse({
    status: 200,
    description: 'AP invoice type retrieved successfully',
    type: ApInvoiceTypesDto,
  })
  @ApiResponse({ status: 404, description: 'AP invoice type not found' })
  async findOne(@Param('code') code: string) {
    try {
      const result =
        await this.apInvoiceTypesService.findApInvoiceTypeByCode(code);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AP invoice type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('ap_invoice_types.findAll')
  async findAllMicroservice(@Payload() query: ApInvoiceTypesQueryDto) {
    try {
      const data =
        await this.apInvoiceTypesService.findAllApInvoiceTypes(query);
      const total = await this.apInvoiceTypesService.countApInvoiceTypes(query);
      return { data, total };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve AP invoice types',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('ap_invoice_types.findOne')
  async findOneMicroservice(@Payload() data: { code: string }) {
    try {
      return await this.apInvoiceTypesService.findApInvoiceTypeByCode(
        data.code,
      );
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AP invoice type not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
