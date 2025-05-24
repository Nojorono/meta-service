import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalesmanMetaService } from '../services/salesman.service';
import {
  SalesmanMetaResponseDto,
  SalesmanMetaDtoByDate,
  SalesmanMetaDtoBySalesrepNumber,
} from '../dtos/salesman.dtos';

@Controller()
export class SalesmanMetaMicroserviceController {
  private readonly logger = new Logger(SalesmanMetaMicroserviceController.name);

  constructor(private readonly salesmanMetaService: SalesmanMetaService) {}

  @MessagePattern('ping_salesman')
  ping() {
    return { status: true, message: 'connected to salesman microservice' };
  }

  @MessagePattern('echo_salesman')
  echo(@Payload() data: any) {
    this.logger.log(
      'Received echo request with payload salesman microservice',
      data,
    );
    return { status: true, message: 'echo', data };
  }

  @MessagePattern('get_meta_salesmen_by_salesrep_number')
  async getSalesmenBySalesrepNumber(
    @Payload() params?: SalesmanMetaDtoBySalesrepNumber,
  ): Promise<SalesmanMetaResponseDto> {
    this.logger.log(
      '==== Received request for Oracle salesmen with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.salesmanMetaService.getSalesmanFromOracleBySalesrepNumber(
          params,
        );
      this.logger.log(
        `Oracle getSalesman result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle salesmen: ${error.message}`,
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

  @MessagePattern('get_meta_salesmen_by_date')
  async getSalesmenByDate(
    @Payload() params?: SalesmanMetaDtoByDate,
  ): Promise<SalesmanMetaResponseDto> {
    this.logger.log(
      '==== Received request for Oracle salesmen with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.salesmanMetaService.getSalesmanFromOracleByDate(params);
      this.logger.log(
        `Oracle getSalesman result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle salesmen: ${error.message}`,
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

  @MessagePattern('invalidate_salesman_cache')
  async invalidateSalesmanCache(
    @Payload() data?: { salesman_number?: string },
  ): Promise<{ status: boolean; message: string }> {
    try {
      this.logger.log(
        `Received request to invalidate salesman cache: ${JSON.stringify(data || {})}`,
      );

      await this.salesmanMetaService.invalidateSalesmanCache(
        data?.salesman_number,
      );

      return {
        status: true,
        message: data?.salesman_number
          ? `Cache invalidated for salesman code ${data.salesman_number}`
          : 'All salesman caches invalidated',
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
