import {
  Controller,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApInvoiceTypesService } from '../services/ap-invoice-types.service';
import { ApInvoiceTypesDto } from '../dtos/ap-invoice-types.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('AP Invoice Types')
@Controller('ap-invoice-types')
@AuthSwagger()
export class ApInvoiceTypesController {
  constructor(private readonly apInvoiceTypesService: ApInvoiceTypesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all invoice types' })
  @ApiResponse({ status: 200, type: [ApInvoiceTypesDto] })
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
  async getAll(): Promise<ApInvoiceTypesDto[]> {
    try {
      return await this.apInvoiceTypesService.findAllApInvoiceTypes();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch invoice types.');
    }
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get invoice type by code' })
  @ApiResponse({ status: 200, type: ApInvoiceTypesDto })
  @ApiResponse({ status: 404, description: 'Invoice type not found.' })
  async getById(@Param('code') code: string): Promise<ApInvoiceTypesDto> {
    try {
      const invoiceType =
        await this.apInvoiceTypesService.findApInvoiceTypeByCode(code);
      if (!invoiceType) {
        throw new NotFoundException('Invoice type not found.');
      }
      return invoiceType;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch invoice type.');
    }
  }
}
