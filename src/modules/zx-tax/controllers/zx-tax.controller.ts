import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';
import { ZxTaxService } from '../services/zx-tax.service';
import { ZxTaxDto, ZxTaxQueryDto } from '../dtos/zx-tax.dtos';

@ApiTags('ZX Tax')
@Controller('zx-tax')
@AuthSwagger()
export class ZxTaxController {
  constructor(private readonly zxTaxService: ZxTaxService) {}

  @Get()
  @ApiOperation({ summary: 'Get all ZX tax records' })
  @ApiResponse({
    status: 200,
    description: 'ZX tax records retrieved successfully',
    type: [ZxTaxDto],
  })
  @ApiQuery({
    name: 'TAX_RATE_CODE',
    required: false,
    description: 'Filter by tax rate code',
  })
  @ApiQuery({
    name: 'PERCENTAGE_RATE',
    required: false,
    description: 'Filter by percentage rate',
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Records per page' })
  async findAll(@Query() query: ZxTaxQueryDto): Promise<any> {
    try {
      const data = await this.zxTaxService.findAllZxTaxes(query);
      const total = await this.zxTaxService.countZxTaxes(query);

      return {
        success: true,
        statusCode: 200,
        message: 'ZX tax records retrieved successfully',
        data,
        pagination: {
          total,
          page: query.page || 1,
          limit: query.limit || 10,
          totalPages: Math.ceil(total / (query.limit || 10)),
        },
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve ZX tax records',
        error: error.message,
      };
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a ZX tax record by ID' })
  @ApiResponse({
    status: 200,
    description: 'ZX tax record retrieved successfully',
    type: ZxTaxDto,
  })
  @ApiResponse({ status: 404, description: 'ZX tax record not found' })
  @ApiParam({
    name: 'id',
    description: 'Tax ID',
    example: '1001',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const result = await this.zxTaxService.findZxTaxById(id);

      if (!result) {
        return {
          success: false,
          statusCode: 404,
          message: 'ZX tax record not found',
          data: null,
        };
      }

      return {
        success: true,
        statusCode: 200,
        message: 'ZX tax record retrieved successfully',
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: 'Failed to retrieve ZX tax record',
        error: error.message,
      };
    }
  }
}
