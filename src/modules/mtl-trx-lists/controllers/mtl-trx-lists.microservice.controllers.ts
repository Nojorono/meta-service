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
import { MtlTrxListsService } from '../services/mtl-trx-lists.service';
import {
  MtlTrxListsDto,
  MtlTrxListsQueryDto,
} from '../dtos/mtl-trx-lists.dtos';

@ApiTags('Material Transaction Lists')
@Controller('mtl-trx-lists')
export class MtlTrxListsMicroserviceController {
  constructor(private readonly mtlTrxListsService: MtlTrxListsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all material transaction lists' })
  @ApiResponse({
    status: 200,
    description: 'Material transaction lists retrieved successfully',
    type: [MtlTrxListsDto],
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
    name: 'TRANSACTION_ID',
    required: false,
    type: Number,
    description: 'Transaction ID',
  })
  @ApiQuery({
    name: 'ORGANIZATION_ID',
    required: false,
    type: Number,
    description: 'Organization ID',
  })
  @ApiQuery({
    name: 'ORGANIZATION_CODE',
    required: false,
    type: String,
    description: 'Organization code',
  })
  @ApiQuery({
    name: 'INVENTORY_ITEM_ID',
    required: false,
    type: Number,
    description: 'Inventory item ID',
  })
  @ApiQuery({
    name: 'ITEM_CODE',
    required: false,
    type: String,
    description: 'Item code',
  })
  @ApiQuery({
    name: 'TRANSACTION_TYPE_ID',
    required: false,
    type: Number,
    description: 'Transaction type ID',
  })
  @ApiQuery({
    name: 'TRANSACTION_TYPE_NAME',
    required: false,
    type: String,
    description: 'Transaction type name',
  })
  @ApiQuery({
    name: 'SUBINVENTORY_CODE',
    required: false,
    type: String,
    description: 'Subinventory code',
  })
  async findAll(@Query() query: MtlTrxListsQueryDto) {
    try {
      const result = await this.mtlTrxListsService.findAll(query);
      return {
        success: true,
        data: result.data,
        total: result.total,
        page: query.page || 1,
        limit: query.limit || 10,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve material transaction lists',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material transaction list by ID' })
  @ApiResponse({
    status: 200,
    description: 'Material transaction list retrieved successfully',
    type: MtlTrxListsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Material transaction list not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.mtlTrxListsService.findOne(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Material transaction list not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('mtl_trx_lists.findAll')
  async findAllMicroservice(@Payload() query: MtlTrxListsQueryDto) {
    try {
      return await this.mtlTrxListsService.findAll(query);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve material transaction lists',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('mtl_trx_lists.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.mtlTrxListsService.findOne(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Material transaction list not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
