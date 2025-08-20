import { Controller, Get, Param, Query, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { CurrencyService } from '../services/currency.service';
import { CurrencyDto, CurrencyQueryDto } from '../dtos/currency.dtos';

@ApiTags('Currency')
@Controller('currency')
@AuthSwagger()
export class CurrencyController {
  private readonly logger = new Logger(CurrencyController.name);

  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all currencies' })
  @ApiResponse({
    status: 200,
    description: 'Return all currencies',
    type: [CurrencyDto],
  })
  @ApiQuery({
    name: 'CURRENCY_CODE',
    required: false,
    description: 'Filter by currency code',
  })
  @ApiQuery({
    name: 'NAME',
    required: false,
    description: 'Filter by currency name',
  })
  @ApiQuery({
    name: 'ENABLED_FLAG',
    required: false,
    description: 'Filter by enabled flag',
  })
  @ApiQuery({ name: 'PAGE', required: false, description: 'Page number' })
  @ApiQuery({ name: 'LIMIT', required: false, description: 'Records per page' })
  async findAll(@Query() query: CurrencyQueryDto): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { PAGE = 1, LIMIT = 10, ..._filters } = query;

    const [data, total] = await Promise.all([
      this.currencyService.findAllCurrencies(query),
      this.currencyService.countCurrencies(query),
    ]);

    return {
      success: true,
      statusCode: 200,
      message: 'Currencies retrieved successfully',
      data,
      pagination: {
        page: Number(PAGE),
        limit: Number(LIMIT),
        total,
        totalPages: Math.ceil(total / Number(LIMIT)),
      },
    };
  }

  @Get('name/:name')
  @ApiOperation({ summary: 'Get currencies by name' })
  @ApiParam({ name: 'name', description: 'Currency name' })
  @ApiResponse({
    status: 200,
    description: 'Return currencies with the specified name',
    type: [CurrencyDto],
  })
  async findByName(@Param('name') name: string): Promise<any> {
    const data = await this.currencyService.findAllCurrencies({ NAME: name });
    return {
      success: true,
      statusCode: 200,
      message: 'Currencies retrieved successfully',
      data,
    };
  }

  @Get('enabled/:ENABLED_FLAG')
  @ApiOperation({ summary: 'Get currencies by enabled flag' })
  @ApiParam({ name: 'ENABLED_FLAG', description: 'Enabled flag (Y/N)' })
  @ApiResponse({
    status: 200,
    description: 'Return currencies with the specified enabled flag',
    type: [CurrencyDto],
  })
  async findByEnabledFlag(
    @Param('ENABLED_FLAG') ENABLED_FLAG: string,
  ): Promise<any> {
    const data = await this.currencyService.findAllCurrencies({ ENABLED_FLAG });
    return {
      success: true,
      statusCode: 200,
      message: 'Currencies retrieved successfully',
      data,
    };
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a currency by code' })
  @ApiParam({ name: 'code', description: 'Currency code' })
  @ApiResponse({
    status: 200,
    description: 'Return the currency',
    type: CurrencyDto,
  })
  async findByCode(@Param('code') code: string): Promise<any> {
    const data = await this.currencyService.findCurrencyByCode(code);
    return {
      success: true,
      statusCode: 200,
      message: 'Currency retrieved successfully',
      data,
    };
  }
}
