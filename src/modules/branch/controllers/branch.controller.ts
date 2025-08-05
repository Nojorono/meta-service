import {
  Controller,
  Get,
  Query,
  Logger,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { BranchMetaService } from '../services/branch.service';
import {
  MetaBranchResponseDto,
  MetaBranchDtoByDate,
} from '../dtos/branch.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('Branch Meta')
@Controller('branch')
export class BranchMetaController {
  private readonly logger = new Logger(BranchMetaController.name);

  constructor(private readonly branchMetaService: BranchMetaService) {}

  @Get('search')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Search branches',
    description:
      'Search branches by query across organization code, name, region, and address',
  })
  @ApiQuery({
    name: 'q',
    required: true,
    type: String,
    description: 'Search query to filter branches',
    example: 'JAKARTA',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit the number of results (optional)',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'Branches found',
    type: MetaBranchResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - search query is required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async searchBranches(
    @Query('q') searchQuery: string,
    @Query('limit') limit?: number,
  ): Promise<MetaBranchResponseDto> {
    this.logger.log('==== REST API: Search branches ====');
    this.logger.log(
      `Search query: ${searchQuery}, limit: ${limit || 'no limit'}`,
    );

    try {
      if (!searchQuery || searchQuery.trim() === '') {
        return {
          data: [],
          count: 0,
          status: false,
          message: 'Search query is required',
        };
      }

      // Get all branches first
      const allBranches =
        await this.branchMetaService.getBranchesFromOracleByDate();

      if (!allBranches.status || !allBranches.data) {
        return allBranches;
      }

      // Filter branches based on search query
      const query = searchQuery.toLowerCase();
      let filteredBranches = allBranches.data.filter(
        (branch) =>
          branch.organization_code?.toLowerCase().includes(query) ||
          branch.organization_name?.toLowerCase().includes(query) ||
          branch.region_code?.toLowerCase().includes(query) ||
          branch.address?.toLowerCase().includes(query),
      );

      // Apply limit if specified
      if (limit && limit > 0) {
        filteredBranches = filteredBranches.slice(0, limit);
      }

      const result = {
        data: filteredBranches,
        count: filteredBranches.length,
        status: true,
        message: `Found ${filteredBranches.length} branches matching '${searchQuery}'`,
      };

      this.logger.log(
        `REST API searchBranches result: status=${result.status}, count=${result.count}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error searching branches: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error searching branch data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get branches by date',
    description: 'Retrieve branches filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter branches by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Branches retrieved successfully',
    type: MetaBranchResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid date format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getBranchesByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<MetaBranchResponseDto> {
    this.logger.log('==== REST API: Get branches by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: MetaBranchDtoByDate = { last_update_date: lastUpdateDate };
      const result =
        await this.branchMetaService.getBranchesFromOracleByDate(params);
      this.logger.log(
        `REST API getBranchesByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving branches by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving branch data: ${error.message}`,
      };
    }
  }

  @Get('region/:regionCode')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get branches by region code',
    description: 'Retrieve all branches in a specific region',
  })
  @ApiParam({
    name: 'regionCode',
    required: true,
    type: String,
    description: 'Region code to filter branches',
    example: '201301',
  })
  @ApiResponse({
    status: 200,
    description: 'Branches retrieved successfully',
    type: MetaBranchResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No branches found in this region',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getBranchesByRegion(
    @Param('regionCode') regionCode: string,
  ): Promise<MetaBranchResponseDto> {
    this.logger.log('==== REST API: Get branches by region ====');
    this.logger.log(`Region code: ${regionCode}`);

    try {
      // Get all branches first
      const allBranches =
        await this.branchMetaService.getBranchesFromOracleByDate();

      if (!allBranches.status || !allBranches.data) {
        return allBranches;
      }

      // Filter branches by region code
      const filteredBranches = allBranches.data.filter(
        (branch) => branch.region_code === regionCode,
      );

      const result = {
        data: filteredBranches,
        count: filteredBranches.length,
        status: true,
        message:
          filteredBranches.length > 0
            ? `Found ${filteredBranches.length} branches in region ${regionCode}`
            : `No branches found in region ${regionCode}`,
      };

      this.logger.log(
        `REST API getBranchesByRegion result: status=${result.status}, count=${result.count}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving branches by region: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving branch data: ${error.message}`,
      };
    }
  }

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all branches',
    description: 'Retrieve all branches from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'Branches retrieved successfully',
    type: MetaBranchResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getBranches(): Promise<MetaBranchResponseDto> {
    this.logger.log('==== REST API: Get all branches ====');

    try {
      const result = await this.branchMetaService.getBranchesFromOracleByDate();
      this.logger.log(
        `REST API getBranches result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving branches: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving branch data: ${error.message}`,
      };
    }
  }

  @Get(':id')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get branch by ID',
    description: 'Retrieve a specific branch by organization ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'Organization ID of the branch',
    example: 111,
  })
  @ApiResponse({
    status: 200,
    description: 'Branch retrieved successfully',
    type: MetaBranchResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Branch not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getBranchById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MetaBranchResponseDto> {
    this.logger.log('==== REST API: Get branch by ID ====');
    this.logger.log(`Branch ID: ${id}`);

    try {
      // Get all branches first
      const allBranches =
        await this.branchMetaService.getBranchesFromOracleByDate();

      if (!allBranches.status || !allBranches.data) {
        return allBranches;
      }

      // Find specific branch by organization_id
      const branch = allBranches.data.find((b) => b.organization_id === id);

      if (!branch) {
        return {
          data: [],
          count: 0,
          status: false,
          message: `Branch with ID ${id} not found`,
        };
      }

      const result = {
        data: [branch],
        count: 1,
        status: true,
        message: `Branch ${branch.organization_name} retrieved successfully`,
      };

      this.logger.log(
        `REST API getBranchById result: status=${result.status}, found=${branch.organization_name}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving branch by ID: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving branch data: ${error.message}`,
      };
    }
  }
}
