import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PriceListService } from '../services/price-list.service';
import { PriceListDto, PriceListQueryDto } from '../dtos/price-list.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Price List')
@Controller('price-list')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Get()
  @ApiOperation({ summary: 'Get all price lists' })
  @ApiResponse({
    status: 200,
    description: 'Return all price lists',
    type: [PriceListDto],
  })
  @ApiQuery({ name: 'priceName', required: false, description: 'Filter by price name' })
  @ApiQuery({ name: 'itemCode', required: false, description: 'Filter by item code' })
  @ApiQuery({ name: 'itemDescription', required: false, description: 'Filter by item description' })
  @ApiQuery({ name: 'productUomCode', required: false, description: 'Filter by product UOM code' })
  @ApiQuery({ name: 'customerNumber', required: false, description: 'Filter by customer number' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: PriceListQueryDto): Promise<any> {
    const { page = 1, limit = 10, ...filters } = query;
    
    const [data, total] = await Promise.all([
      this.priceListService.findAllPriceLists(query),
      this.priceListService.countPriceLists(query)
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Price lists retrieved successfully',
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  @Get('price-name/:priceName')
  @ApiOperation({ summary: 'Get price lists by price name' })
  @ApiParam({ name: 'priceName', description: 'Price name' })
  @ApiResponse({
    status: 200,
    description: 'Return price lists with the specified price name',
    type: [PriceListDto],
  })
  async findByPriceName(@Param('priceName') priceName: string): Promise<any> {
    const data = await this.priceListService.findAllPriceLists({ priceName });
    return {
      success: true,
      statusCode: 200,
      message: 'Price lists retrieved successfully',
      data,
    };
  }

  @Get('item-code/:itemCode')
  @ApiOperation({ summary: 'Get price lists by item code' })
  @ApiParam({ name: 'itemCode', description: 'Item code' })
  @ApiResponse({
    status: 200,
    description: 'Return price lists with the specified item code',
    type: [PriceListDto],
  })
  async findByItemCode(@Param('itemCode') itemCode: string): Promise<any> {
    const data = await this.priceListService.findAllPriceLists({ itemCode });
    return {
      success: true,
      statusCode: 200,
      message: 'Price lists retrieved successfully',
      data,
    };
  }

  @Get('customer/:customerNumber')
  @ApiOperation({ summary: 'Get price lists by customer number' })
  @ApiParam({ name: 'customerNumber', description: 'Customer number' })
  @ApiResponse({
    status: 200,
    description: 'Return price lists with the specified customer number',
    type: [PriceListDto],
  })
  async findByCustomerNumber(@Param('customerNumber') customerNumber: string): Promise<any> {
    const data = await this.priceListService.findAllPriceLists({ customerNumber });
    return {
      success: true,
      statusCode: 200,
      message: 'Price lists retrieved successfully',
      data,
    };
  }

  @Get('uom/:productUomCode')
  @ApiOperation({ summary: 'Get price lists by product UOM code' })
  @ApiParam({ name: 'productUomCode', description: 'Product UOM code' })
  @ApiResponse({
    status: 200,
    description: 'Return price lists with the specified product UOM code',
    type: [PriceListDto],
  })
  async findByProductUomCode(@Param('productUomCode') productUomCode: string): Promise<any> {
    const data = await this.priceListService.findAllPriceLists({ productUomCode });
    return {
      success: true,
      statusCode: 200,
      message: 'Price lists retrieved successfully',
      data,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a price list by ID' })
  @ApiParam({ name: 'id', description: 'Price list ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the price list',
    type: PriceListDto,
  })
  async findById(@Param('id') id: number): Promise<any> {
    const data = await this.priceListService.findPriceListById(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Price list retrieved successfully',
      data,
    };
  }

  // Microservice endpoints
  @MessagePattern('price-list.findAll')
  async findAllMicroservice(@Payload() query: PriceListQueryDto): Promise<any> {
    const { page = 1, limit = 10, ...filters } = query;
    
    const [data, total] = await Promise.all([
      this.priceListService.findAllPriceLists(query),
      this.priceListService.countPriceLists(query)
    ]);

    return {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  @MessagePattern('price-list.findById')
  async findByIdMicroservice(@Payload() id: number): Promise<PriceListDto> {
    return await this.priceListService.findPriceListById(id);
  }

  @MessagePattern('price-list.findByPriceName')
  async findByPriceNameMicroservice(@Payload() priceName: string): Promise<PriceListDto[]> {
    return await this.priceListService.findAllPriceLists({ priceName });
  }

  @MessagePattern('price-list.findByItemCode')
  async findByItemCodeMicroservice(@Payload() itemCode: string): Promise<PriceListDto[]> {
    return await this.priceListService.findAllPriceLists({ itemCode });
  }

  @MessagePattern('price-list.findByCustomerNumber')
  async findByCustomerNumberMicroservice(@Payload() customerNumber: string): Promise<PriceListDto[]> {
    return await this.priceListService.findAllPriceLists({ customerNumber });
  }

  @MessagePattern('price-list.findByProductUomCode')
  async findByProductUomCodeMicroservice(@Payload() productUomCode: string): Promise<PriceListDto[]> {
    return await this.priceListService.findAllPriceLists({ productUomCode });
  }
}
