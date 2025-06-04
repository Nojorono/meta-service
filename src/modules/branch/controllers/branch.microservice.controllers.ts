import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BranchMetaService } from '../services/branch.service';
import {
  MetaBranchResponseDto,
  MetaBranchDtoByDate,
} from '../dtos/branch.dtos';

@Controller()
export class BranchMetaMicroserviceController {
  private readonly logger = new Logger(BranchMetaMicroserviceController.name);

  constructor(private readonly branchMetaService: BranchMetaService) {}

  @MessagePattern('ping_branch')
  ping() {
    return { status: true, message: 'connected to branch microservice' };
  }

  @MessagePattern('echo_branch')
  echo(@Payload() data: any) {
    this.logger.log(
      'Received echo request with payload branch microservice',
      data,
    );
    return { status: true, message: 'echo', data };
  }

  @MessagePattern('get_meta_branches_by_date')
  async getBranchesByDate(
    @Payload() params?: MetaBranchDtoByDate,
  ): Promise<MetaBranchResponseDto> {
    this.logger.log(
      '==== Received request for Oracle branches with params ====',
    );
    this.logger.log(JSON.stringify(params || {}));

    try {
      const result =
        await this.branchMetaService.getBranchesFromOracleByDate(params);
      this.logger.log(
        `Oracle getBranches result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Error retrieving Oracle branches: ${error.message}`,
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

  //   @MessagePattern('get_meta_branch_by_id')
  //   async getBranchById(
  //     @Payload() data: { branchId: number },
  //   ): Promise<MetaBranchResponseDto> {
  //     this.logger.log(
  //       `==== Received request for Oracle branch with ID: ${data?.branchId} ====`,
  //     );

  //     if (!data || typeof data.branchId !== 'number') {
  //       this.logger.error(`Invalid branch ID received: ${JSON.stringify(data)}`);
  //       return {
  //         data: [],
  //         count: 0,
  //         status: false,
  //         message: 'Invalid branch ID format',
  //       };
  //     }

  //     try {
  //       const result = await this.branchMetaService.getBranchByIdFromOracle(
  //         data.branchId,
  //       );
  //       this.logger.log(
  //         `Oracle getBranchById result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
  //       );
  //       return result;
  //     } catch (error) {
  //       this.logger.error(
  //         `Error retrieving Oracle branch by ID ${data.branchId}: ${error.message}`,
  //         error.stack,
  //       );
  //       return {
  //         data: [],
  //         count: 0,
  //         status: false,
  //         message: `Error in microservice: ${error.message}`,
  //       };
  //     }
  //   }
}
