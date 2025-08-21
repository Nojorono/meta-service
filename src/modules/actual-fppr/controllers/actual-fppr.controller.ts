import {
  Controller,
  Post,
  Body,
  Logger,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { ActualFpprService } from '../services/actual-fppr.service';
import {
  CreateActualFpprDto,
  ActualFpprResponseDto,
} from '../dtos/actual-fppr.dtos';

@ApiTags('Actual FPPR')
@Controller('actual-fppr')
@AuthSwagger()
export class ActualFpprController {
  private readonly logger = new Logger(ActualFpprController.name);

  constructor(private readonly actualFpprService: ActualFpprService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  @ApiOperation({ summary: 'Create a new actual FPPR record' })
  @ApiResponse({
    status: 201,
    description: 'Actual FPPR created successfully',
    type: ActualFpprResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async createActualFppr(@Body() createDto: CreateActualFpprDto): Promise<any> {
    try {
      const data = await this.actualFpprService.createActualFppr(createDto);
      return data;
    } catch (error) {
      this.logger.error('Error creating actual FPPR:', error);
      throw error;
    }
  }
}
