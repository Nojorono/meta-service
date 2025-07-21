import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CustomerMetaService } from '../services/customer.service';
import {
  MetaCustomerResponseDto,
  PaginationParamsDto,
  MetaCustomerDtoByDate,
} from '../dtos/customer.dtos';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
export class CustomerMetaMicroserviceController {
  private readonly logger = new Logger(CustomerMetaMicroserviceController.name);

  constructor(private readonly customerMetaService: CustomerMetaService) {}

  @MessagePattern('ping_customer')
  ping() {
    return { status: true, message: 'connected to customer microservice' };
  }

  @MessagePattern('echo_customer')
  echo(@Payload() data: any) {
    this.logger.log(
      'Received echo request with payload customer microservice',
      data,
    );
    return { status: true, message: 'echo', data };
  }

  @MessagePattern('get_meta_customers')
  async getCustomers(
    @Payload() params?: PaginationParamsDto,
  ): Promise<MetaCustomerResponseDto> {
    this.logger.log(
      '==== Received request for Oracle customers with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.customerMetaService.getCustomersFromOracle(params);
      this.logger.log(
        `Oracle getCustomers result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle customers: ${error.message}`,
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

  @MessagePattern('get_meta_customers_by_date')
  async getCustomersByDate(
    @Payload() params?: MetaCustomerDtoByDate,
  ): Promise<MetaCustomerResponseDto> {
    this.logger.log(
      '==== Received request for Oracle customers with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.customerMetaService.getCustomersFromOracleByDate(params);
      this.logger.log(
        `Oracle getCustomers result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle customers: ${error.message}`,
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

  @MessagePattern('get_meta_customer_by_id')
  async getCustomerById(
    @Payload() data: { customerId: number },
  ): Promise<MetaCustomerResponseDto> {
    this.logger.log(
      `==== Received request for Oracle customer with ID: ${data?.customerId} ====`,
    );

    if (!data || typeof data.customerId !== 'number') {
      this.logger.error(
        `Invalid customer ID received: ${JSON.stringify(data)}`,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: 'Invalid customer ID format',
      };
    }

    try {
      const result = await this.customerMetaService.getCustomerByIdFromOracle(
        data.customerId,
      );
      this.logger.log(
        `Oracle getCustomerById result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle customer by ID ${data.customerId}: ${error.message}`,
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

  @MessagePattern('invalidate_customer_cache')
  async invalidateCustomerCache(
    @Payload() data?: { customerId?: number },
  ): Promise<{ status: boolean; message: string }> {
    try {
      this.logger.log(
        `Received request to invalidate customer cache: ${JSON.stringify(data || {})}`,
      );

      await this.customerMetaService.invalidateCustomerCache(data?.customerId);

      return {
        status: true,
        message: data?.customerId
          ? `Cache invalidated for customer ID ${data.customerId}`
          : 'All customer caches invalidated',
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

  // Additional message patterns from customer.microservice.controllers.ts
  @MessagePattern('customer.findAll')
  @Internal()
  async findAll(@Payload() data: any) {
    try {
      return await this.customerMetaService.getCustomersFromOracle(data);
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern('customer.findById')
  @Internal()
  async findById(@Payload() data: { customerId: string }) {
    try {
      return await this.customerMetaService.getCustomersFromOracle({
        page: 1,
        limit: 1,
        search: data.customerId,
      });
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  @MessagePattern('customer.findByDate')
  @Internal()
  async findByDate(@Payload() data: any) {
    try {
      return await this.customerMetaService.getCustomersFromOracleByDate(data);
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
