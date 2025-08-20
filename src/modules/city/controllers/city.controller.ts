import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';
import { CityService } from '../services/city.service';
import { CityDto, CityQueryDto } from '../dtos/city.dtos';

@ApiTags('City')
@Controller('city')
@AuthSwagger()
export class CityController {
  private readonly logger = new Logger(CityController.name);

  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all cities',
    description: 'Retrieve a list of all cities from XTD_FND_KOTAMADYA_V view',
  })
  @ApiQuery({
    name: 'PROVINSI_CODE',
    required: false,
    description: 'Filter by province code',
    example: '11',
  })
  @ApiQuery({
    name: 'KOTAMADYA_CODE',
    required: false,
    description: 'Filter by city code',
    example: '1111',
  })
  @ApiQuery({
    name: 'KOTAMADYA',
    required: false,
    description: 'Filter by city name',
    example: 'Jakarta',
  })
  @ApiQuery({
    name: 'PAGE',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'LIMIT',
    required: false,
    description: 'Number of records per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of cities retrieved successfully',
    type: [CityDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllCities(@Query() queryDto: CityQueryDto): Promise<CityDto[]> {
    try {
      this.logger.log('Fetching all cities with filters:', queryDto);
      return await this.cityService.findAllCities(queryDto);
    } catch (error) {
      this.logger.error('Error fetching cities:', error);
      throw new HttpException(
        'Failed to fetch cities',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get city count',
    description: 'Get the total count of cities matching the filter criteria',
  })
  @ApiQuery({
    name: 'PROVINSI_CODE',
    required: false,
    description: 'Filter by province code',
    example: '11',
  })
  @ApiQuery({
    name: 'KOTAMADYA_CODE',
    required: false,
    description: 'Filter by city code',
    example: '1111',
  })
  @ApiQuery({
    name: 'KOTAMADYA',
    required: false,
    description: 'Filter by city name',
    example: 'Jakarta',
  })
  @ApiResponse({
    status: 200,
    description: 'City count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 514 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getCityCount(
    @Query() queryDto: CityQueryDto,
  ): Promise<{ count: number }> {
    try {
      this.logger.log('Getting city count with filters:', queryDto);
      const count = await this.cityService.getCityCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting city count:', error);
      throw new HttpException(
        'Failed to get city count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('province/:PROVINSI_CODE')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get cities by province code',
    description:
      'Retrieve all cities for a specific province from XTD_FND_KOTAMADYA_V view',
  })
  @ApiParam({
    name: 'PROVINSI_CODE',
    description: 'Province code',
    example: 'JKT',
  })
  @ApiResponse({
    status: 200,
    description: 'Cities retrieved successfully',
    type: [CityDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findCitiesByProvinceCode(
    @Param('PROVINSI_CODE') PROVINSI_CODE: string,
  ): Promise<CityDto[]> {
    try {
      this.logger.log(`Fetching cities by province code: ${PROVINSI_CODE}`);
      return await this.cityService.findCitiesByProvinceCode(PROVINSI_CODE);
    } catch (error) {
      this.logger.error(
        `Error fetching cities by province code ${PROVINSI_CODE}:`,
        error,
      );
      throw new HttpException(
        'Failed to fetch cities',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get city by code',
    description:
      'Retrieve a specific city by its code from XTD_FND_KOTAMADYA_V view',
  })
  @ApiParam({
    name: 'code',
    description: 'City code',
    example: 'JKT01',
  })
  @ApiResponse({
    status: 200,
    description: 'City retrieved successfully',
    type: CityDto,
  })
  @ApiResponse({
    status: 404,
    description: 'City not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findCityByCode(@Param('code') code: string): Promise<CityDto> {
    try {
      this.logger.log(`Fetching city by code: ${code}`);
      const city = await this.cityService.findCityByCode(code);

      if (!city) {
        throw new HttpException(
          `City with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return city;
    } catch (error) {
      this.logger.error(`Error fetching city by code ${code}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch city',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
