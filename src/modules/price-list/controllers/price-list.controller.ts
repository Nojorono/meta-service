import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { PriceListService } from '../services/price-list.service';
import { PriceListDto, PriceListQueryDto } from '../dtos/price-list.dtos';

@ApiTags('Price Lists')
@AuthSwagger()
@Controller('price-lists')
export class PriceListController {
  private readonly logger = new Logger(PriceListController.name);

  constructor(private readonly priceListService: PriceListService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all price lists with filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Price lists retrieved successfully',
    type: [PriceListDto],
  })
  async findAll(@Query() query: PriceListQueryDto): Promise<any> {
    const { page = 1, limit = 10 } = query;

    const [data, total] = await Promise.all([
      this.priceListService.findAllPriceLists(query),
      this.priceListService.countPriceLists(query),
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
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  @Get(':priceListId/:priceListLineId')
  @ApiOperation({
    summary: 'Get a specific price list item by price list ID and line ID',
  })
  @ApiParam({ name: 'priceListId', description: 'Price List ID' })
  @ApiParam({ name: 'priceListLineId', description: 'Price List Line ID' })
  @ApiResponse({
    status: 200,
    description: 'Price list item retrieved successfully',
    type: PriceListDto,
  })
  @ApiResponse({ status: 404, description: 'Price list item not found' })
  async findOne(
    @Param('priceListId') priceListId: string,
    @Param('priceListLineId') priceListLineId: string,
  ): Promise<any> {
    try {
      const result = await this.priceListService.findPriceListById(
        parseInt(priceListId),
        parseInt(priceListLineId),
      );

      if (!result) {
        return {
          success: false,
          statusCode: 404,
          message: 'Price list item not found',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'Price list item retrieved successfully',
        data: result,
      };
    } catch (error) {
      this.logger.error('Error fetching price list item:', error);
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve price list item',
        data: null,
      };
    }
  }

  @Get('by-price-list/:priceListId')
  @ApiOperation({ summary: 'Get all items by price list ID' })
  @ApiParam({ name: 'priceListId', description: 'Price List ID' })
  @ApiResponse({
    status: 200,
    description: 'Price list items retrieved successfully',
    type: [PriceListDto],
  })
  async findByPriceListId(
    @Param('priceListId') priceListId: string,
  ): Promise<any> {
    try {
      const data = await this.priceListService.findByPriceListId(
        parseInt(priceListId),
      );

      return {
        success: true,
        statusCode: 200,
        message: 'Price list items retrieved successfully',
        data,
      };
    } catch (error) {
      this.logger.error('Error fetching price list items:', error);
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve price list items',
        data: null,
      };
    }
  }
}
