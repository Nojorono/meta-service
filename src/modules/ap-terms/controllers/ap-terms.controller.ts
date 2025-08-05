import {
  Controller,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ApTermsService } from '../services/ap-terms.service';
import { ApTermsDto } from '../dtos/ap-terms.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('AP Terms')
@Controller('ap-terms')
@AuthSwagger()
export class ApTermsController {
  constructor(private readonly apTermsService: ApTermsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all terms' })
  @ApiResponse({ status: 200, type: [ApTermsDto] })
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
  async getAll(): Promise<ApTermsDto[]> {
    try {
      return await this.apTermsService.findAllApTerms();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch terms.');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get term by ID' })
  @ApiResponse({ status: 200, type: ApTermsDto })
  @ApiResponse({ status: 404, description: 'Term not found.' })
  async getById(@Param('id') id: string): Promise<ApTermsDto> {
    try {
      const term = await this.apTermsService.findApTermById(Number(id));
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
