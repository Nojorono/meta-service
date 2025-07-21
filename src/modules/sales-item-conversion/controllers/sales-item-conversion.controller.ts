import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { SalesItemConversionService } from '../services/sales-item-conversion.service';
import {
  SalesItemConversionDto,
  SalesItemConversionQueryDto,
} from '../dtos/sales-item-conversion.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Sales Item Conversion')
@Controller('sales-item-conversion')
export class SalesItemConversionController {
  constructor(
    private readonly salesItemConversionService: SalesItemConversionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all sales item conversions' })
  @ApiResponse({
    status: 200,
    description: 'Return all sales item conversions',
    type: [SalesItemConversionDto],
  })
  @ApiQuery({
    name: 'itemCode',
    required: false,
    description: 'Filter by item code',
  })
  @ApiQuery({
    name: 'itemNumber',
    required: false,
    description: 'Filter by item number',
  })
  @ApiQuery({
    name: 'itemDescription',
    required: false,
    description: 'Filter by item description',
  })
  @ApiQuery({
    name: 'sourceUomCode',
    required: false,
    description: 'Filter by source UOM code',
  })
  @ApiQuery({
    name: 'baseUomCode',
    required: false,
    description: 'Filter by base UOM code',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: SalesItemConversionQueryDto): Promise<any> {
    const data =
      await this.salesItemConversionService.findAllSalesItemConversions(query);
    const total =
      await this.salesItemConversionService.countSalesItemConversions(query);
    return {
      success: true,
      statusCode: 200,
      message: 'Sales item conversions retrieved successfully',
      data,
      pagination: {
        page: query.page || 1,
        limit: query.limit || 10,
        total,
        totalPages: Math.ceil(total / (query.limit || 10)),
      },
    };
  }

  @Get('item-code/:itemCode')
  @ApiOperation({ summary: 'Get sales item conversions by item code' })
  @ApiParam({ name: 'itemCode', description: 'Item code' })
  @ApiResponse({
    status: 200,
    description: 'Return sales item conversions with the specified item code',
    type: [SalesItemConversionDto],
  })
  async findByItemCode(@Param('itemCode') itemCode: string): Promise<any> {
    const data =
      await this.salesItemConversionService.findAllSalesItemConversions({
        itemCode,
      });
    return {
      success: true,
      statusCode: 200,
      message: 'Sales item conversions retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sales item conversion by ID' })
  @ApiParam({ name: 'id', description: 'Sales item conversion ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the sales item conversion',
    type: SalesItemConversionDto,
  })
  async findById(@Param('id') id: number): Promise<any> {
    const data =
      await this.salesItemConversionService.findSalesItemConversionById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Sales item conversion retrieved successfully',
      data,
    };
  }

  // Microservice endpoints
  @MessagePattern('sales-item-conversion.findAll')
  async findAllMicroservice(): Promise<SalesItemConversionDto[]> {
    return await this.salesItemConversionService.findAllSalesItemConversions();
  }

  @MessagePattern('sales-item-conversion.findById')
  async findByIdMicroservice(
    @Payload() id: number,
  ): Promise<SalesItemConversionDto> {
    return await this.salesItemConversionService.findSalesItemConversionById(
      id,
    );
  }

  @MessagePattern('sales-item-conversion.findByItemCode')
  async findByItemCodeMicroservice(
    @Payload() itemCode: string,
  ): Promise<SalesItemConversionDto[]> {
    return await this.salesItemConversionService.findAllSalesItemConversions({
      itemCode,
    });
  }
}
