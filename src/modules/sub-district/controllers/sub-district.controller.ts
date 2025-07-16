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
import { SubDistrictService } from '../services/sub-district.service';
import { SubDistrictDto, SubDistrictQueryDto } from '../dtos/sub-district.dtos';

@ApiTags('Sub-District')
@Controller('sub-district')
@Public()
export class SubDistrictController {
  private readonly logger = new Logger(SubDistrictController.name);

  constructor(private readonly subDistrictService: SubDistrictService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all sub-districts',
    description: 'Retrieve a list of all sub-districts from XTD_FND_KELURAHAN_V view'
  })
  @ApiQuery({
    name: 'kecamatanCode',
    required: false,
    description: 'Filter by district code',
    example: 'JKT0101'
  })
  @ApiQuery({
    name: 'kelurahanCode',
    required: false,
    description: 'Filter by sub-district code',
    example: 'JKT010101'
  })
  @ApiQuery({
    name: 'kelurahanName',
    required: false,
    description: 'Filter by sub-district name',
    example: 'Gondangdia'
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
    description: 'List of sub-districts retrieved successfully',
    type: [SubDistrictDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllSubDistricts(@Query() queryDto: SubDistrictQueryDto): Promise<SubDistrictDto[]> {
    try {
      this.logger.log('Fetching all sub-districts with filters:', queryDto);
      return await this.subDistrictService.findAllSubDistricts(queryDto);
    } catch (error) {
      this.logger.error('Error fetching sub-districts:', error);
      throw new HttpException(
        'Failed to fetch sub-districts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Get sub-district count',
    description: 'Get the total count of sub-districts matching the filter criteria'
  })
  @ApiQuery({
    name: 'kecamatanCode',
    required: false,
    description: 'Filter by district code',
    example: 'JKT0101'
  })
  @ApiQuery({
    name: 'kelurahanCode',
    required: false,
    description: 'Filter by sub-district code',
    example: 'JKT010101'
  })
  @ApiQuery({
    name: 'kelurahanName',
    required: false,
    description: 'Filter by sub-district name',
    example: 'Gondangdia'
  })
  @ApiResponse({
    status: 200,
    description: 'Sub-district count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 80000 }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getSubDistrictCount(@Query() queryDto: SubDistrictQueryDto): Promise<{ count: number }> {
    try {
      this.logger.log('Getting sub-district count with filters:', queryDto);
      const count = await this.subDistrictService.getSubDistrictCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting sub-district count:', error);
      throw new HttpException(
        'Failed to get sub-district count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('district/:districtCode')
  @ApiOperation({ 
    summary: 'Get sub-districts by district code',
    description: 'Retrieve all sub-districts for a specific district from XTD_FND_KELURAHAN_V view'
  })
  @ApiParam({
    name: 'districtCode',
    description: 'District code',
    example: 'JKT0101',
  })
  @ApiResponse({
    status: 200,
    description: 'Sub-districts retrieved successfully',
    type: [SubDistrictDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findSubDistrictsByDistrictCode(@Param('districtCode') districtCode: string): Promise<SubDistrictDto[]> {
    try {
      this.logger.log(`Fetching sub-districts by district code: ${districtCode}`);
      return await this.subDistrictService.findSubDistrictsByDistrictCode(districtCode);
    } catch (error) {
      this.logger.error(`Error fetching sub-districts by district code ${districtCode}:`, error);
      throw new HttpException(
        'Failed to fetch sub-districts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':code')
  @ApiOperation({ 
    summary: 'Get sub-district by code',
    description: 'Retrieve a specific sub-district by its code from XTD_FND_KELURAHAN_V view'
  })
  @ApiParam({
    name: 'code',
    description: 'Sub-district code',
    example: 'JKT010101',
  })
  @ApiResponse({
    status: 200,
    description: 'Sub-district retrieved successfully',
    type: SubDistrictDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Sub-district not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findSubDistrictByCode(@Param('code') code: string): Promise<SubDistrictDto> {
    try {
      this.logger.log(`Fetching sub-district by code: ${code}`);
      const subDistrict = await this.subDistrictService.findSubDistrictByCode(code);
      
      if (!subDistrict) {
        throw new HttpException(
          `Sub-district with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return subDistrict;
    } catch (error) {
      this.logger.error(`Error fetching sub-district by code ${code}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch sub-district',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
