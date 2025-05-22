import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmployeeMetaService } from '../services/employee.service';
import {
  EmployeeMetaResponseDto,
  EmployeeMetaDtoByDate,
  EmployeeMetaDtoByEmployeeNumber,
} from '../dtos/employee.dtos';
import { EmployeeHrisDto } from '../dtos/employee.hris.dto';

@Controller()
export class EmployeeMetaMicroserviceController {
  private readonly logger = new Logger(EmployeeMetaMicroserviceController.name);

  constructor(private readonly employeeMetaService: EmployeeMetaService) {}

  @MessagePattern('ping')
  ping() {
    this.logger.log('Received ping request employee microservice');
    return { status: true, message: 'pong' };
  }

  @MessagePattern('echo')
  echo(@Payload() data: any) {
    this.logger.log(
      'Received echo request with payload employee microservice',
      data,
    );
    return { status: true, message: 'echo', data };
  }

  @MessagePattern('post_meta_employee_hris')
  async postEmployeeHris(@Payload() params?: EmployeeHrisDto): Promise<any> {
    this.logger.log(
      '==== Received request for Oracle employee with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result = await this.employeeMetaService.postEmployeeHris(params);
      this.logger.log(
        `Oracle postEmployeeHris result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle employee: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error in microservice post_meta_employee_hris: ${error.message}`,
      };
    }
  }

  @MessagePattern('get_meta_employee_by_employee_number')
  async getEmployeeByEmployeeNumber(
    @Payload() params?: EmployeeMetaDtoByEmployeeNumber,
  ): Promise<EmployeeMetaResponseDto> {
    this.logger.log(
      '==== Received request for Oracle employee with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.employeeMetaService.getEmployeeFromOracleByEmployeeNumber(
          params,
        );
      this.logger.log(
        `Oracle getEmployee result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle employee: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error in microservice: ${error.message}`,
      };
    }
  }

  @MessagePattern('get_meta_employee_by_date')
  async getEmployeeByDate(
    @Payload() params?: EmployeeMetaDtoByDate,
  ): Promise<EmployeeMetaResponseDto> {
    this.logger.log(
      '==== Received request for Oracle employee with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.employeeMetaService.getEmployeeFromOracleByDate(params);
      this.logger.log(
        `Oracle getEmployee result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle employee: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error in microservice: ${error.message}`,
      };
    }
  }

  @MessagePattern('invalidate_employee_cache')
  async invalidateEmployeeCache(
    @Payload() data?: { employee_number?: string },
  ): Promise<{ status: boolean; message: string }> {
    try {
      this.logger.log(
        `Received request to invalidate employee cache: ${JSON.stringify(data || {})}`,
      );

      await this.employeeMetaService.invalidateEmployeeCache(
        data?.employee_number,
      );

      return {
        status: true,
        message: data?.employee_number
          ? `Cache invalidated for employee code ${data.employee_number}`
          : 'All employee caches invalidated',
      };
    } catch (error) {
      this.logger.error(
        `Error invalidating cache: ${error.message}`,
        error.stack,
      );
      return {
        status: false,
        message: `Error invalidating cache: ${error.message}`,
      };
    }
  }
}
