import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ItemListMetaService } from '../services/item-list.service';
import {
  MetaItemListDto,
  MetaItemListDtoByItemCode,
  MetaItemListResponseDto,
} from '../dtos/item-list.dtos';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Item List Meta')
@Controller('item-list')
export class ItemListMetaController {
  private readonly logger = new Logger(ItemListMetaController.name);

  constructor(private readonly itemListMetaService: ItemListMetaService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Get all sales items',
    description: 'Retrieve all sales items from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'Sales items retrieved successfully',
    type: MetaItemListResponseDto,
  })
  async getItemList(): Promise<MetaItemListResponseDto> {
    this.logger.log('==== REST API: Get all sales items ====');

    try {
      const result = await this.itemListMetaService.getItemListFromOracleByItemCode();
      this.logger.log(
        `REST API getItemList result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving sales items: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving sales items data: ${error.message}`,
      };
    }
  }

  @Get('by-item-code')
  @Public()
  @ApiOperation({
    summary: 'Get item list by item code',
    description: 'Retrieve item list filtered by item code',
  })
  @ApiQuery({ 
    name: 'item_code', 
    required: true, 
    type: String, 
    description: 'Filter sales items by item code',
    example: 'ARB16'
  })
  @ApiResponse({
    status: 200,
    description: 'Item list retrieved successfully',
    type: MetaItemListResponseDto,
  })
  async getItemListByDate(
    @Query('item_code',) itemCode: string,
  ): Promise<MetaItemListResponseDto> {
    this.logger.log('==== REST API: Get sales items by item code ====');
    this.logger.log(`Item Code filter: ${itemCode}`);

    try {
      const params: MetaItemListDtoByItemCode = { item_code: itemCode };
      const result = await this.itemListMetaService.getItemListFromOracleByItemCode(params);
      this.logger.log(
        `REST API getItemListByItemCode result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving item list by item code: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving items list data: ${error.message}`,
      };
    }
  }
}
