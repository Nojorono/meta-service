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
  constructor(private readonly apTermsService: ArTermsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all AR terms' })
  @ApiResponse({ status: 200, description: 'AR terms retrieved successfully', type: [ArTermsDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'TERM_ID', required: false, type: Number, description: 'Term ID' })
  @ApiQuery({ name: 'TERM_NAME', required: false, type: String, description: 'Term Name' })
  @ApiQuery({ name: 'DESCRIPTION', required: false, type: String, description: 'Description' })
  @ApiQuery({ name: 'ENABLED_FLAG', required: false, type: String, description: 'Enabled flag' })
  async findAll(@Query() query: ArTermsQueryDto) {
    try {
      const data = await this.apTermsService.findAllArTerms(query);
      const total = await this.apTermsService.countArTerms(query);
      return {
        success: true,
        data,
        total,
        page: query.page || 1,
        limit: query.limit || 10,
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
  @ApiOperation({ summary: 'Get AP term by ID' })
  @ApiResponse({ status: 200, description: 'AP term retrieved successfully', type: ArTermsDto })
  @ApiResponse({ status: 404, description: 'AP term not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.apTermsService.findArTermById(id);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AP term not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @MessagePattern('ap_terms.findAll')
  async findAllMicroservice(@Payload() query: ArTermsQueryDto) {
    try {
      const data = await this.apTermsService.findAllArTerms(query);
      const total = await this.apTermsService.countArTerms(query);
      return { data, total };
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

  @MessagePattern('ap_terms.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.apTermsService.findArTermById(data.id);
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'AP term not found',
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
