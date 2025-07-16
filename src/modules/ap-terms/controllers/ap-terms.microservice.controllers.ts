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
import { ApTermsService } from '../services/ap-terms.service';
import { ApTermsDto, ApTermsQueryDto } from '../dtos/ap-terms.dtos';

@ApiTags('AP Terms')
@Controller('ap-terms')
export class ApTermsMicroserviceController {
  constructor(private readonly apTermsService: ApTermsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all AP terms' })
  @ApiResponse({ status: 200, description: 'AP terms retrieved successfully', type: [ApTermsDto] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({ name: 'TERM_ID', required: false, type: Number, description: 'Term ID' })
  @ApiQuery({ name: 'NAME', required: false, type: String, description: 'Name' })
  @ApiQuery({ name: 'TYPE', required: false, type: String, description: 'Type' })
  @ApiQuery({ name: 'ENABLED_FLAG', required: false, type: String, description: 'Enabled flag' })
  async findAll(@Query() query: ApTermsQueryDto) {
    try {
      const data = await this.apTermsService.findAllApTerms(query);
      const total = await this.apTermsService.countApTerms(query);
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
          message: 'Failed to retrieve AP terms',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get AP term by ID' })
  @ApiResponse({ status: 200, description: 'AP term retrieved successfully', type: ApTermsDto })
  @ApiResponse({ status: 404, description: 'AP term not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.apTermsService.findApTermById(id);
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
  async findAllMicroservice(@Payload() query: ApTermsQueryDto) {
    try {
      const data = await this.apTermsService.findAllApTerms(query);
      const total = await this.apTermsService.countApTerms(query);
      return { data, total };
    } catch (error) {
      throw new HttpException(
        {
          success: false,
          message: 'Failed to retrieve AP terms',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('ap_terms.findOne')
  async findOneMicroservice(@Payload() data: { id: number }) {
    try {
      return await this.apTermsService.findApTermById(data.id);
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
