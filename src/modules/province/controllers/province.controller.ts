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
import { Public } from 'src/decorators/public.decorator';
import { ProvinceService } from '../services/province.service';
import { ProvinceDto, ProvinceQueryDto } from '../dtos/province.dtos';

@ApiTags('Province')
@Controller('province')
@Public()
export class ProvinceController {
  private readonly logger = new Logger(ProvinceController.name);

  constructor(private readonly provinceService: ProvinceService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all provinces',
    description: 'Retrieve a list of all provinces from XTD_FND_PROVINSI_V view'
  })
  @ApiQuery({
    name: 'provinsiCode',
    required: false,
    description: 'Filter by province code',
    example: 'JKT'
  })
  @ApiQuery({
    name: 'provinsiName',
    required: false,
    description: 'Filter by province name',
    example: 'Jakarta'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'List of provinces retrieved successfully',
    type: [ProvinceDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllProvinces(@Query() queryDto: ProvinceQueryDto): Promise<ProvinceDto[]> {
    try {
      this.logger.log('Fetching all provinces with filters:', queryDto);
      return await this.provinceService.findAllProvinces(queryDto);
    } catch (error) {
      this.logger.error('Error fetching provinces:', error);
      throw new HttpException(
        'Failed to fetch provinces',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Get province count',
    description: 'Get the total count of provinces matching the filter criteria'
  })
  @ApiQuery({
    name: 'provinsiCode',
    required: false,
    description: 'Filter by province code',
    example: 'JKT'
  })
  @ApiQuery({
    name: 'provinsiName',
    required: false,
    description: 'Filter by province name',
    example: 'Jakarta'
  })
  @ApiResponse({
    status: 200,
    description: 'Province count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 34 }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getProvinceCount(@Query() queryDto: ProvinceQueryDto): Promise<{ count: number }> {
    try {
      this.logger.log('Getting province count with filters:', queryDto);
      const count = await this.provinceService.getProvinceCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting province count:', error);
      throw new HttpException(
        'Failed to get province count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @ApiOperation({ 
    summary: 'Get province by code',
    description: 'Retrieve a specific province by its code from XTD_FND_PROVINSI_V view'
  })
  @ApiParam({
    name: 'code',
    description: 'Province code',
    example: 'JKT',
  })
  @ApiResponse({
    status: 200,
    description: 'Province retrieved successfully',
    type: ProvinceDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Province not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findProvinceByCode(@Param('code') code: string): Promise<ProvinceDto> {
    try {
      this.logger.log(`Fetching province by code: ${code}`);
      const province = await this.provinceService.findProvinceByCode(code);
      
      if (!province) {
        throw new HttpException(
          `Province with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return province;
    } catch (error) {
      this.logger.error(`Error fetching province by code ${code}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch province',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
