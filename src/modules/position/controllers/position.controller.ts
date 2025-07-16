import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';
import { PositionService } from '../services/position.service';
import { PositionDto, PositionQueryDto } from '../dtos/position.dtos';

@ApiTags('Position')
@Controller('position')
@Public()
export class PositionController {
  private readonly logger = new Logger(PositionController.name);

  constructor(private readonly positionService: PositionService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all positions',
    description: 'Retrieve a list of all positions from XTD_HR_POSITIONS_V view'
  })
  @ApiQuery({
    name: 'positionCode',
    required: false,
    description: 'Filter by position code',
    example: 'POS001'
  })
  @ApiQuery({
    name: 'positionName',
    required: false,
    description: 'Filter by position name',
    example: 'Manager'
  })
  @ApiQuery({
    name: 'positionLevel',
    required: false,
    description: 'Filter by position level',
    example: 'MANAGER'
  })
  @ApiQuery({
    name: 'positionGroup',
    required: false,
    description: 'Filter by position group',
    example: 'SALES'
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'Filter by organization ID',
    example: 101
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
    description: 'List of positions retrieved successfully',
    type: [PositionDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllPositions(@Query() queryDto: PositionQueryDto): Promise<PositionDto[]> {
    try {
      this.logger.log('Fetching all positions with filters:', queryDto);
      return await this.positionService.findAllPositions(queryDto);
    } catch (error) {
      this.logger.error('Error fetching positions:', error);
      throw new HttpException(
        'Failed to fetch positions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @ApiOperation({ 
    summary: 'Get position count',
    description: 'Get the total count of positions matching the filter criteria'
  })
  @ApiQuery({
    name: 'positionCode',
    required: false,
    description: 'Filter by position code',
    example: 'POS001'
  })
  @ApiQuery({
    name: 'positionName',
    required: false,
    description: 'Filter by position name',
    example: 'Manager'
  })
  @ApiQuery({
    name: 'positionLevel',
    required: false,
    description: 'Filter by position level',
    example: 'MANAGER'
  })
  @ApiQuery({
    name: 'positionGroup',
    required: false,
    description: 'Filter by position group',
    example: 'SALES'
  })
  @ApiQuery({
    name: 'organizationId',
    required: false,
    description: 'Filter by organization ID',
    example: 101
  })
  @ApiResponse({
    status: 200,
    description: 'Position count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 100 }
      }
    }
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getPositionCount(@Query() queryDto: PositionQueryDto): Promise<{ count: number }> {
    try {
      this.logger.log('Getting position count with filters:', queryDto);
      const count = await this.positionService.getPositionCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting position count:', error);
      throw new HttpException(
        'Failed to get position count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('organization/:orgId')
  @ApiOperation({ 
    summary: 'Get positions by organization ID',
    description: 'Retrieve all positions for a specific organization from XTD_HR_POSITIONS_V view'
  })
  @ApiParam({
    name: 'orgId',
    description: 'Organization ID',
    example: 101,
  })
  @ApiResponse({
    status: 200,
    description: 'Positions retrieved successfully',
    type: [PositionDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findPositionsByOrganizationId(@Param('orgId', ParseIntPipe) orgId: number): Promise<PositionDto[]> {
    try {
      this.logger.log(`Fetching positions by organization ID: ${orgId}`);
      return await this.positionService.findPositionsByOrganizationId(orgId);
    } catch (error) {
      this.logger.error(`Error fetching positions by organization ID ${orgId}:`, error);
      throw new HttpException(
        'Failed to fetch positions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('code/:code')
  @ApiOperation({ 
    summary: 'Get position by code',
    description: 'Retrieve a specific position by its code from XTD_HR_POSITIONS_V view'
  })
  @ApiParam({
    name: 'code',
    description: 'Position code',
    example: 'POS001',
  })
  @ApiResponse({
    status: 200,
    description: 'Position retrieved successfully',
    type: PositionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Position not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findPositionByCode(@Param('code') code: string): Promise<PositionDto> {
    try {
      this.logger.log(`Fetching position by code: ${code}`);
      const position = await this.positionService.findPositionByCode(code);
      
      if (!position) {
        throw new HttpException(
          `Position with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return position;
    } catch (error) {
      this.logger.error(`Error fetching position by code ${code}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch position',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get position by ID',
    description: 'Retrieve a specific position by its ID from XTD_HR_POSITIONS_V view'
  })
  @ApiParam({
    name: 'id',
    description: 'Position ID',
    example: 1001,
  })
  @ApiResponse({
    status: 200,
    description: 'Position retrieved successfully',
    type: PositionDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Position not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findPositionById(@Param('id', ParseIntPipe) id: number): Promise<PositionDto> {
    try {
      this.logger.log(`Fetching position by ID: ${id}`);
      const position = await this.positionService.findPositionById(id);
      
      if (!position) {
        throw new HttpException(
          `Position with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return position;
    } catch (error) {
      this.logger.error(`Error fetching position by ID ${id}:`, error);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        'Failed to fetch position',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
