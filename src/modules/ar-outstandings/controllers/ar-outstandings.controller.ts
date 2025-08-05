import {
  Controller,
  Get,
  Param,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ArOutstandingsService } from '../services/ar-outstandings.service';
import { ArOutstandingsDto } from '../dtos/ar-outstandings.dtos';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';

@ApiTags('AR Outstandings')
@Controller('ar-outstandings')
@AuthSwagger()
export class ArOutstandingsController {
  constructor(private readonly arOutstandingsService: ArOutstandingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all outstandings' })
  @ApiResponse({ status: 200, type: [ArOutstandingsDto] })
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
  async getAll(): Promise<ArOutstandingsDto[]> {
    try {
      return await this.arOutstandingsService.findAllArOutstandings();
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch outstandings.');
    }
  }

  @Get(':call_plan_number')
  @ApiOperation({ summary: 'Get outstandings by CALL_PLAN_NUMBER' })
  @ApiResponse({ status: 200, type: ArOutstandingsDto })
  @ApiResponse({ status: 404, description: 'Outstandings not found.' })
  async getById(
    @Param('call_plan_number') callPlanNumber: string,
  ): Promise<ArOutstandingsDto> {
    try {
      const term =
        await this.arOutstandingsService.findArOutstandingsById(callPlanNumber);
      if (!term) {
        throw new NotFoundException('Outstandings not found.');
      }
      return term;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch outstandings.');
    }
  }
}
