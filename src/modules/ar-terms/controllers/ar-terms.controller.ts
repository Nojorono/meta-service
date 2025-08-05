import {
  Controller,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ArTermsService } from '../services/ar-terms.service';
import { ArTermsDto } from '../dtos/ar-terms.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('AR Terms')
@Controller('ar-terms')
@AuthSwagger()
export class ArTermsController {
  constructor(private readonly arTermsService: ArTermsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all terms' })
  @ApiResponse({ status: 200, type: [ArTermsDto] })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  async getAll(): Promise<ArTermsDto[]> {
    try {
      return await this.arTermsService.findAllArTerms();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch terms.');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get term by ID' })
  @ApiResponse({ status: 200, type: ArTermsDto })
  @ApiResponse({ status: 404, description: 'Term not found.' })
  async getById(@Param('id') id: string): Promise<ArTermsDto> {
    try {
      const term = await this.arTermsService.findArTermById(Number(id));
      if (!term) {
        throw new NotFoundException('Term not found.');
      }
      return term;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch term.');
    }
  }
}
