import { Controller, Get, Query, Param, Logger, Version } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EmployeeMetaService } from '../services/employee.service';
import {
  EmployeeMetaResponseDto,
  EmployeeMetaDtoByDate,
  EmployeeMetaDtoByEmployeeNumber,
  EmployeeQueryDto,
} from '../dtos/employee.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('Employee Meta')
@Controller('employee')
@AuthSwagger()
export class EmployeeMetaController {
  private readonly logger = new Logger(EmployeeMetaController.name);

  constructor(private readonly employeeMetaService: EmployeeMetaService) {}

  @Get()
  @Version('1')
  @ApiOperation({
    summary: 'Get all employees',
    description: 'Retrieve all employees from Oracle database. Add pagination parameters for paginated results.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: all data)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: all data)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by employee name or number',
    example: 'John',
  })
  @ApiQuery({
    name: 'employee_number',
    required: false,
    type: String,
    description: 'Filter by specific employee number',
    example: 'EMP001',
  })
  @ApiQuery({
    name: 'organization_code',
    required: false,
    type: String,
    description: 'Filter by organization code',
    example: 'ORG001',
  })
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully',
    type: EmployeeMetaResponseDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getEmployees(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
    @Query('employee_number') employee_number?: string,
    @Query('organization_code') organization_code?: string,
  ): Promise<EmployeeMetaResponseDto> {
    this.logger.log('==== REST API: Get all employees ====');

    try {
      // If pagination parameters are provided, use pagination logic
      if (page || limit) {
        this.logger.log('Using pagination logic');
        const params: EmployeeQueryDto = {
          search,
          employee_number,
          organization_code,
          page: page || 1,
          limit: limit || 10,
        };
        
        const result = await this.employeeMetaService.findAllEmployees(params);
        this.logger.log(
          `REST API getEmployees (paginated) result: status=${result.status}, count=${result.count}, page=${params.page}, limit=${params.limit}`,
        );
        return result;
      } else {
        // Use existing method for full data
        this.logger.log('Using full data logic');
        const result = await this.employeeMetaService.getEmployeeFromOracleByDate();
        this.logger.log(
          `REST API getEmployees result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
        );
        return result;
      }
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving employees: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving employee data: ${error.message}`,
      };
    }
  }

  @Get('by-date')
  @ApiOperation({
    summary: 'Get employees by date',
    description: 'Retrieve employees filtered by last update date',
  })
  @ApiQuery({
    name: 'last_update_date',
    required: true,
    type: String,
    description: 'Filter employees by last update date (YYYY-MM-DD format)',
    example: '2024-01-15',
  })
  @ApiResponse({
    status: 200,
    description: 'Employees retrieved successfully',
    type: EmployeeMetaResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid date format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getEmployeesByDate(
    @Query('last_update_date') lastUpdateDate: string,
  ): Promise<EmployeeMetaResponseDto> {
    this.logger.log('==== REST API: Get employees by date ====');
    this.logger.log(`Date filter: ${lastUpdateDate}`);

    try {
      const params: EmployeeMetaDtoByDate = {
        last_update_date: lastUpdateDate,
      };
      const result =
        await this.employeeMetaService.getEmployeeFromOracleByDate(params);
      this.logger.log(
        `REST API getEmployeesByDate result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving employees by date: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving employee data: ${error.message}`,
      };
    }
  }

  @Get(':employeeNumber')
  @ApiOperation({
    summary: 'Get employee by number',
    description: 'Retrieve a specific employee by their employee number',
  })
  @ApiParam({
    name: 'employeeNumber',
    type: String,
    description: 'Employee number',
    example: 'EMP001',
  })
  @ApiResponse({
    status: 200,
    description: 'Employee retrieved successfully',
    type: EmployeeMetaResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Employee not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getEmployeeByNumber(
    @Param('employeeNumber') employeeNumber: string,
  ): Promise<EmployeeMetaResponseDto> {
    this.logger.log(
      `==== REST API: Get employee by number: ${employeeNumber} ====`,
    );

    try {
      const params: EmployeeMetaDtoByEmployeeNumber = {
        employee_number: employeeNumber,
      };
      const result =
        await this.employeeMetaService.getEmployeeFromOracleByEmployeeNumber(
          params,
        );
      this.logger.log(
        `REST API getEmployeeByNumber result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving employee by number: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving employee data: ${error.message}`,
      };
    }
  }

}