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
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';
import { HrOperatingUnitsService } from '../services/hr-operating-units.service';
import {
  HrOperatingUnitsDto,
  HrOperatingUnitsQueryDto,
} from '../dtos/hr-operating-units.dtos';

@ApiTags('HR Operating Units')
@Controller('hr-operating-units')
@AuthSwagger()
export class HrOperatingUnitsController {
  private readonly logger = new Logger(HrOperatingUnitsController.name);

  constructor(
    private readonly hrOperatingUnitsService: HrOperatingUnitsService,
  ) {}

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all HR operating units',
    description:
      'Retrieve a list of all HR operating units from XTD_HR_OPERATING_UNITS_V view',
  })
  @ApiQuery({
    name: 'businessGroupId',
    required: false,
    description: 'Filter by business group ID',
    example: 101,
  })
  @ApiQuery({
    name: 'locationCode',
    required: false,
    description: 'Filter by location code',
    example: 'JKT',
  })
  @ApiQuery({
    name: 'orgName',
    required: false,
    description: 'Filter by organization name',
    example: 'Jakarta',
  })
  @ApiQuery({
    name: 'orgCode',
    required: false,
    description: 'Filter by organization code',
    example: 'ORG001',
  })
  @ApiQuery({
    name: 'shortCode',
    required: false,
    description: 'Filter by short code',
    example: 'JKT',
  })
  @ApiQuery({
    name: 'usableFlag',
    required: false,
    description: 'Filter by usable flag (Y/N)',
    example: 'Y',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of operating units retrieved successfully',
    type: [HrOperatingUnitsDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllOperatingUnits(
    @Query() queryDto: HrOperatingUnitsQueryDto,
  ): Promise<HrOperatingUnitsDto[]> {
    try {
      this.logger.log('Fetching all operating units with filters:', queryDto);
      return await this.hrOperatingUnitsService.findAllOperatingUnits(
        queryDto,
      );
    } catch (error) {
      this.logger.error('Error fetching operating units:', error);
      throw new HttpException(
        'Failed to fetch operating units',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get operating units count',
    description:
      'Get the total count of operating units matching the filter criteria',
  })
  @ApiQuery({
    name: 'businessGroupId',
    required: false,
    description: 'Filter by business group ID',
    example: 101,
  })
  @ApiQuery({
    name: 'locationCode',
    required: false,
    description: 'Filter by location code',
    example: 'JKT',
  })
  @ApiQuery({
    name: 'orgName',
    required: false,
    description: 'Filter by organization name',
    example: 'Jakarta',
  })
  @ApiQuery({
    name: 'orgCode',
    required: false,
    description: 'Filter by organization code',
    example: 'ORG001',
  })
  @ApiQuery({
    name: 'shortCode',
    required: false,
    description: 'Filter by short code',
    example: 'JKT',
  })
  @ApiQuery({
    name: 'usableFlag',
    required: false,
    description: 'Filter by usable flag (Y/N)',
    example: 'Y',
  })
  @ApiResponse({
    status: 200,
    description: 'Operating units count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 50 },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getOperatingUnitsCount(
    @Query() queryDto: HrOperatingUnitsQueryDto,
  ): Promise<{ count: number }> {
    try {
      this.logger.log('Getting operating units count with filters:', queryDto);
      const count =
        await this.hrOperatingUnitsService.getOperatingUnitsCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting operating units count:', error);
      throw new HttpException(
        'Failed to get operating units count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('code/:code')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get operating unit by code',
    description:
      'Retrieve a specific operating unit by its code from XTD_HR_OPERATING_UNITS_V view',
  })
  @ApiParam({
    name: 'code',
    description: 'Organization code',
    example: 'ORG001',
  })
  @ApiResponse({
    status: 200,
    description: 'Operating unit retrieved successfully',
    type: HrOperatingUnitsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Operating unit not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOperatingUnitByCode(
    @Param('code') code: string,
  ): Promise<HrOperatingUnitsDto> {
    try {
      this.logger.log(`Fetching operating unit by code: ${code}`);
      const operatingUnit =
        await this.hrOperatingUnitsService.findOperatingUnitByCode(code);

      if (!operatingUnit) {
        throw new HttpException(
          `Operating unit with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return operatingUnit;
    } catch (error) {
      this.logger.error(
        `Error fetching operating unit by code ${code}:`,
        error,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch operating unit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get operating unit by ID',
    description:
      'Retrieve a specific operating unit by its ID from XTD_HR_OPERATING_UNITS_V view',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID (ORG_ID)',
    example: 201,
  })
  @ApiResponse({
    status: 200,
    description: 'Operating unit retrieved successfully',
    type: HrOperatingUnitsDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Operating unit not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOperatingUnitById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<HrOperatingUnitsDto> {
    try {
      this.logger.log(`Fetching operating unit by ID: ${id}`);
      const operatingUnit =
        await this.hrOperatingUnitsService.findOperatingUnitById(id);

      if (!operatingUnit) {
        throw new HttpException(
          `Operating unit with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return operatingUnit;
    } catch (error) {
      this.logger.error(`Error fetching operating unit by ID ${id}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch operating unit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

