import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { BranchMetaService } from '../services/branch.service';
import {
  MetaBranchResponseDto,
  MetaBranchDtoByDate,
} from '../dtos/branch.dtos';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Branch Meta')
@Controller('branch')
export class BranchMetaController {
  private readonly logger = new Logger(BranchMetaController.name);

  constructor(private readonly branchMetaService: BranchMetaService) {}

  @Get()
  @Public()
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

  @Get('by-date')
  @Public()
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
}
