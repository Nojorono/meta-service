import {
  Controller,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { MtlTrxListsService } from '../services/mtl-trx-lists.service';
import {
  MtlTrxListsDto,
  MtlTrxListsQueryDto,
} from '../dtos/mtl-trx-lists.dtos';

@ApiTags('Material Transaction Lists')
@Controller('mtl-trx-lists')
@AuthSwagger()
export class MtlTrxListsController {
  private readonly logger = new Logger(MtlTrxListsController.name);

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
    name: 'TRANSACTION_TYPE_NAME',
    required: false,
    type: String,
    description: 'Transaction type name',
  })
  @ApiQuery({
    name: 'FPPR_NUMBER',
    required: false,
    type: String,
    description: 'FPPR number',
  })
  @ApiQuery({
    name: 'REFERENCE_NUMBER',
    required: false,
    type: String,
    description: 'Reference number',
  })
  @ApiQuery({
    name: 'ITEM_CODE',
    required: false,
    type: String,
    description: 'Item code',
  })
  @ApiQuery({
    name: 'ORGANIZATION_CODE',
    required: false,
    type: String,
    description: 'Organization code',
  })
  @ApiQuery({
    name: 'SUBINVENTORY',
    required: false,
    type: String,
    description: 'Subinventory',
  })
  async findAll(@Query() query: MtlTrxListsQueryDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page = 1, limit = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.mtlTrxListsService.findAll(query),
      this.mtlTrxListsService.countMtlTrxLists(query),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Material transaction lists retrieved successfully',
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get material transaction list by ID' })
  @ApiParam({ name: 'id', description: 'Material transaction list ID' })
  @ApiResponse({
    status: 200,
    description: 'Material transaction list retrieved successfully',
    type: MtlTrxListsDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const data = await this.mtlTrxListsService.findOne(id);
    return {
      success: true,
      statusCode: 200,
      message: 'Material transaction list retrieved successfully',
      data,
    };
  }
}
