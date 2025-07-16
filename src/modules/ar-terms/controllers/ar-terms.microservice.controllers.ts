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
import { ArTermsService } from '../services/ar-terms.service';
import { ArTermsDto, ArTermsQueryDto } from '../dtos/ar-terms.dtos';

@ApiTags('AR Terms')
@Controller('ar-terms')
export class ArTermsMicroserviceController {
  constructor(private readonly arTermsService: ArTermsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all AR terms' })
  @ApiResponse({ status: 200, description: 'AR terms retrieved successfully', type: [ArTermsDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'TERM_ID', required: false, type: Number, description: 'Term ID' })
  @ApiQuery({ name: 'NAME', required: false, type: String, description: 'Name' })
  @ApiQuery({ name: 'TYPE', required: false, type: String, description: 'Type' })
  @ApiQuery({ name: 'ENABLED_FLAG', required: false, type: String, description: 'Enabled flag' })
  async findAll(@Query() query: ArTermsQueryDto) {
    try {
      const { page = 1, limit = 10, ...filters } = query;
      
      const [data, total] = await Promise.all([
        this.arTermsService.findAllArTerms(query),
        this.arTermsService.countArTerms(query)
      ]);

      return {
        success: true,
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve AR terms',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AR term by ID' })
  @ApiResponse({ status: 200, description: 'AR term retrieved successfully', type: ArTermsDto })
  @ApiResponse({ status: 404, description: 'AR term not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.arTermsService.findArTermById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AR term not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('ar_terms.findAll')
  async findAllMicroservice(@Payload() query: ArTermsQueryDto) {
    try {
      const { page = 1, limit = 10, ...filters } = query;
      
      const [data, total] = await Promise.all([
        this.arTermsService.findAllArTerms(query),
        this.arTermsService.countArTerms(query)
      ]);

      return {
        data,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit))
        }
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve AR terms',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('ar_terms.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.arTermsService.findArTermById(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AR term not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
