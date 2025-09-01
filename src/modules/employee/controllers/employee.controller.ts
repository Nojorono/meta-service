import { Controller, Get, Query, Param, Logger, Post, Body } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { EmployeeMetaService } from '../services/employee.service';
import {
  EmployeeMetaResponseDto,
  EmployeeMetaDtoByDate,
  EmployeeMetaDtoByEmployeeNumber,
} from '../dtos/employee.dtos';
import { EmployeeHrisDto } from '../dtos/employee.hris.dto';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('Employee Meta')
@Controller('employee')
@AuthSwagger()
export class EmployeeMetaController {
  private readonly logger = new Logger(EmployeeMetaController.name);

  constructor(private readonly employeeMetaService: EmployeeMetaService) { }

  @Get()
  @ApiOperation({
    summary: 'Get all employees',
    description: 'Retrieve all employees from Oracle database',
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
  async getEmployees(): Promise<EmployeeMetaResponseDto> {
    this.logger.log('==== REST API: Get all employees ====');

    try {
      const result =
        await this.employeeMetaService.getEmployeeFromOracleByDate();
      this.logger.log(
        `REST API getEmployees result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
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

  @Post('hris')
  @ApiOperation({
    summary: 'Post employee HRIS data',
    description: 'Insert employee HRIS data into Oracle staging table',
  })
  @ApiBody({
    type: EmployeeHrisDto,
    description: 'Employee HRIS data to be inserted',
  })
  @ApiResponse({
    status: 201,
    description: 'Employee HRIS data posted successfully',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'array' },
        count: { type: 'number' },
        status: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - invalid data format',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async postEmployeeHris(@Body() params?: EmployeeHrisDto): Promise<any> {
    this.logger.log('==== REST API: Post employee HRIS data ====');
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result = await this.employeeMetaService.postEmployeeHris(params);
      this.logger.log(
        `REST API postEmployeeHris result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error posting employee HRIS data: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error posting employee HRIS data: ${error.message}`,
      };
    }
  }
}
