import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CurrencyService } from '../services/currency.service';
import { CurrencyDto, CurrencyQueryDto } from '../dtos/currency.dtos';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all currencies' })
  @ApiResponse({
    status: 200,
    description: 'Return all currencies',
    type: [CurrencyDto],
  })
  @ApiQuery({ name: 'CURRENCY_CODE', required: false, description: 'Filter by currency code' })
  @ApiQuery({ name: 'NAME', required: false, description: 'Filter by currency name' })
  @ApiQuery({ name: 'ENABLED_FLAG', required: false, description: 'Filter by enabled flag' })
  @ApiQuery({ name: 'PAGE', required: false, description: 'Page number' })
  @ApiQuery({ name: 'LIMIT', required: false, description: 'Records per page' })
  async findAll(@Query() query: CurrencyQueryDto): Promise<any> {
    const data = await this.currencyService.findAllCurrencies(query);
    const total = await this.currencyService.countCurrencies(query);
    return {
      success: true,
      statusCode: 200,
      message: 'Currencies retrieved successfully',
      data,
      pagination: {
        page: query.PAGE || 1,
        limit: query.LIMIT || 10,
        total,
        totalPages: Math.ceil(total / (query.LIMIT || 10)),
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
  async findByEnabledFlag(@Param('ENABLED_FLAG') ENABLED_FLAG: string): Promise<any> {
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

  // Microservice endpoints
  @MessagePattern('currency.findAll')
  async findAllMicroservice(): Promise<CurrencyDto[]> {
    return await this.currencyService.findAllCurrencies();
  }

  @MessagePattern('currency.findByCode')
  async findByCodeMicroservice(@Payload() code: string): Promise<CurrencyDto> {
    return await this.currencyService.findCurrencyByCode(code);
  }

  @MessagePattern('currency.findByName')
  async findByNameMicroservice(@Payload() name: string): Promise<CurrencyDto[]> {
    return await this.currencyService.findAllCurrencies({ NAME : name });
  }

  @MessagePattern('currency.findByEnabledFlag')
  async findByEnabledFlagMicroservice(@Payload() ENABLED_FLAG: string): Promise<CurrencyDto[]> {
    return await this.currencyService.findAllCurrencies({ ENABLED_FLAG });
  }
}
