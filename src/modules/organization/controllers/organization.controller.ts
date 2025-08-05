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
import { OrganizationService } from '../services/organization.service';
import {
  OrganizationDto,
  OrganizationQueryDto,
} from '../dtos/organization.dtos';

@ApiTags('Organization')
@Controller('organization')
@AuthSwagger()
export class OrganizationController {
  private readonly logger = new Logger(OrganizationController.name);

  constructor(private readonly organizationService: OrganizationService) {}

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all organizations',
    description:
      'Retrieve a list of all organizations from XTD_HR_ORGANIZATIONS_V view',
  })
  @ApiQuery({
    name: 'organizationCode',
    required: false,
    description: 'Filter by organization code',
    example: 'ORG001',
  })
  @ApiQuery({
    name: 'organizationName',
    required: false,
    description: 'Filter by organization name',
    example: 'Sales',
  })
  @ApiQuery({
    name: 'organizationType',
    required: false,
    description: 'Filter by organization type',
    example: 'SALES',
  })
  @ApiQuery({
    name: 'locationCode',
    required: false,
    description: 'Filter by location code',
    example: 'JKT',
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
    description: 'List of organizations retrieved successfully',
    type: [OrganizationDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllOrganizations(
    @Query() queryDto: OrganizationQueryDto,
  ): Promise<OrganizationDto[]> {
    try {
      this.logger.log('Fetching all organizations with filters:', queryDto);
      return await this.organizationService.findAllOrganizations(queryDto);
    } catch (error) {
      this.logger.error('Error fetching organizations:', error);
      throw new HttpException(
        'Failed to fetch organizations',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get organization count',
    description:
      'Get the total count of organizations matching the filter criteria',
  })
  @ApiQuery({
    name: 'organizationCode',
    required: false,
    description: 'Filter by organization code',
    example: 'ORG001',
  })
  @ApiQuery({
    name: 'organizationName',
    required: false,
    description: 'Filter by organization name',
    example: 'Sales',
  })
  @ApiQuery({
    name: 'organizationType',
    required: false,
    description: 'Filter by organization type',
    example: 'SALES',
  })
  @ApiQuery({
    name: 'locationCode',
    required: false,
    description: 'Filter by location code',
    example: 'JKT',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization count retrieved successfully',
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
  async getOrganizationCount(
    @Query() queryDto: OrganizationQueryDto,
  ): Promise<{ count: number }> {
    try {
      this.logger.log('Getting organization count with filters:', queryDto);
      const count =
        await this.organizationService.getOrganizationCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting organization count:', error);
      throw new HttpException(
        'Failed to get organization count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('code/:code')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get organization by code',
    description:
      'Retrieve a specific organization by its code from XTD_HR_ORGANIZATIONS_V view',
  })
  @ApiParam({
    name: 'code',
    description: 'Organization code',
    example: 'ORG001',
  })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: OrganizationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOrganizationByCode(
    @Param('code') code: string,
  ): Promise<OrganizationDto> {
    try {
      this.logger.log(`Fetching organization by code: ${code}`);
      const organization =
        await this.organizationService.findOrganizationByCode(code);

      if (!organization) {
        throw new HttpException(
          `Organization with code ${code} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return organization;
    } catch (error) {
      this.logger.error(`Error fetching organization by code ${code}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get organization by ID',
    description:
      'Retrieve a specific organization by its ID from XTD_HR_ORGANIZATIONS_V view',
  })
  @ApiParam({
    name: 'id',
    description: 'Organization ID',
    example: 101,
  })
  @ApiResponse({
    status: 200,
    description: 'Organization retrieved successfully',
    type: OrganizationDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Organization not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findOrganizationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationDto> {
    try {
      this.logger.log(`Fetching organization by ID: ${id}`);
      const organization =
        await this.organizationService.findOrganizationById(id);

      if (!organization) {
        throw new HttpException(
          `Organization with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return organization;
    } catch (error) {
      this.logger.error(`Error fetching organization by ID ${id}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch organization',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
