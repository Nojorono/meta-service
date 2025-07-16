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
import { ZxTaxService } from '../services/zx-tax.service';
import { ZxTaxDto, ZxTaxQueryDto } from '../dtos/zx-tax.dtos';

@ApiTags('Tax')
@Controller('zx-tax')
export class ZxTaxMicroserviceController {
  constructor(private readonly zxTaxService: ZxTaxService) {}

  @Get()
  @ApiOperation({ summary: 'Get all taxes' })
  @ApiResponse({ status: 200, description: 'Taxes retrieved successfully', type: [ZxTaxDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'TAX_ID', required: false, type: Number, description: 'Tax ID' })
  @ApiQuery({ name: 'TAX_NAME', required: false, type: String, description: 'Tax name' })
  @ApiQuery({ name: 'TAX_TYPE_CODE', required: false, type: String, description: 'Tax type code' })
  @ApiQuery({ name: 'TAX_REGIME_CODE', required: false, type: String, description: 'Tax regime code' })
  @ApiQuery({ name: 'TAX_JURISDICTION_CODE', required: false, type: String, description: 'Tax jurisdiction code' })
  @ApiQuery({ name: 'ACTIVE_FLAG', required: false, type: String, description: 'Active flag' })
  async findAll(@Query() query: ZxTaxQueryDto) {
    try {
      const data = await this.zxTaxService.findAllZxTax(query);
      const total = await this.zxTaxService.countZxTax(query);
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
          message: 'Failed to retrieve taxes',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tax by ID' })
  @ApiResponse({ status: 200, description: 'Tax retrieved successfully', type: ZxTaxDto })
  @ApiResponse({ status: 404, description: 'Tax not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.zxTaxService.findZxTaxById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Tax not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('zx_tax.findAll')
  async findAllMicroservice(@Payload() query: ZxTaxQueryDto) {
    try {
      const data = await this.zxTaxService.findAllZxTax(query);
      const total = await this.zxTaxService.countZxTax(query);
      return { data, total };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve taxes',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('zx_tax.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.zxTaxService.findZxTaxById(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Tax not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
