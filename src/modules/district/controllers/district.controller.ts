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
import { DistrictService } from '../services/district.service';
import { DistrictDto, DistrictQueryDto } from '../dtos/district.dtos';

@ApiTags('District')
@Controller('district')
@Public()
export class DistrictController {
  private readonly logger = new Logger(DistrictController.name);

  constructor(private readonly districtService: DistrictService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all districts',
    description: 'Retrieve a list of all districts from XTD_FND_KECAMATAN_V view'
  })
  @ApiQuery({
    name: 'kotamadyaCode',
    required: false,
    description: 'Filter by city code',
    example: 'JKT01'
  })
  @ApiQuery({
    name: 'kecamatanCode',
    required: false,
    description: 'Filter by district code',
    example: 'JKT0101'
  })
  @ApiQuery({
    name: 'kecamatanName',
    required: false,
    description: 'Filter by district name',
    example: 'Menteng'
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
    description: 'List of districts retrieved successfully',
    type: [DistrictDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllDistricts(@Query() queryDto: DistrictQueryDto): Promise<DistrictDto[]> {
    try {
      this.logger.log('Fetching all districts with filters:', queryDto);
      return await this.districtService.findAllDistricts(queryDto);
    } catch (error) {
      this.logger.error('Error fetching districts:', error);
      throw new HttpException(
        'Failed to fetch districts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Get district count',
    description: 'Get the total count of districts matching the filter criteria'
  })
  @ApiQuery({
    name: 'kotamadyaCode',
    required: false,
    description: 'Filter by city code',
    example: 'JKT01'
  })
  @ApiQuery({
    name: 'kecamatanCode',
    required: false,
    description: 'Filter by district code',
    example: 'JKT0101'
  })
  @ApiQuery({
    name: 'kecamatanName',
    required: false,
    description: 'Filter by district name',
    example: 'Menteng'
  })
  @ApiResponse({
    status: 200,
    description: 'District count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 7000 }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getDistrictCount(@Query() queryDto: DistrictQueryDto): Promise<{ count: number }> {
    try {
      this.logger.log('Getting district count with filters:', queryDto);
      const count = await this.districtService.getDistrictCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting district count:', error);
      throw new HttpException(
        'Failed to get district count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('city/:cityCode')
  @ApiOperation({ 
    summary: 'Get districts by city code',
    description: 'Retrieve all districts for a specific city from XTD_FND_KECAMATAN_V view'
  })
  @ApiParam({
    name: 'cityCode',
    description: 'City code',
    example: 'JKT01',
  })
  @ApiResponse({
    status: 200,
    description: 'Districts retrieved successfully',
    type: [DistrictDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findDistrictsByCityCode(@Param('cityCode') cityCode: string): Promise<DistrictDto[]> {
    try {
      this.logger.log(`Fetching districts by city code: ${cityCode}`);
      return await this.districtService.findDistrictsByCityCode(cityCode);
    } catch (error) {
      this.logger.error(`Error fetching districts by city code ${cityCode}:`, error);
      throw new HttpException(
        'Failed to fetch districts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @ApiOperation({ 
    summary: 'Get district by code',
    description: 'Retrieve a specific district by its code from XTD_FND_KECAMATAN_V view'
  })
  @ApiParam({
    name: 'code',
    description: 'District code',
    example: 'JKT0101',
  })
  @ApiResponse({
    status: 200,
    description: 'District retrieved successfully',
    type: DistrictDto,
  })
  @ApiResponse({
    status: 404,
    description: 'District not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findDistrictByCode(@Param('code') code: string): Promise<DistrictDto> {
    try {
      this.logger.log(`Fetching district by code: ${code}`);
      const district = await this.districtService.findDistrictByCode(code);
      
      if (!district) {
        throw new HttpException(
          `District with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return district;
    } catch (error) {
      this.logger.error(`Error fetching district by code ${code}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch district',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
