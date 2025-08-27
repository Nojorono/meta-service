import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TruckUtilService } from '../truck-util.service';
import {
  MetaTruckUtilDtoByItem,
  MetaTruckUtilResponseDto,
} from '../dto/truck-util.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('Truck Util Meta')
@Controller('truck-util')
@AuthSwagger()
export class TruckUtilController {
  private readonly logger = new Logger(TruckUtilController.name);

  constructor(private readonly truckUtilService: TruckUtilService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all truck utility items',
    description: 'Retrieve all truck utility items from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'Truck utility items retrieved successfully',
    type: MetaTruckUtilResponseDto,
  })
  async getTruckUtilList(): Promise<MetaTruckUtilResponseDto> {
    this.logger.log('==== REST API: Get all truck utility items ====');

    try {
      const result =
        await this.truckUtilService.getTruckUtilFromOracleByItem();
      this.logger.log(
        `REST API getTruckUtilList result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving truck utility items: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving truck utility data: ${error.message}`,
      };
    }
  }

  @Get('by-item')
  @ApiOperation({
    summary: 'Get truck utility by item code',
    description: 'Retrieve truck utility filtered by item code',
  })
  @ApiQuery({
    name: 'ITEM',
    required: true,
    type: String,
    description: 'Filter truck utility by item code',
    example: 'TRUCK001',
  })
  @ApiResponse({
    status: 200,
    description: 'Truck utility retrieved successfully',
    type: MetaTruckUtilResponseDto,
  })
  async getTruckUtilByItem(
    @Query('ITEM') item: string,
  ): Promise<MetaTruckUtilResponseDto> {
    this.logger.log('==== REST API: Get truck utility by item ====');
    this.logger.log(`Item filter: ${item}`);

    try {
      const params: MetaTruckUtilDtoByItem = { ITEM: item };
      const result =
        await this.truckUtilService.getTruckUtilFromOracleByItem(params);
      this.logger.log(
        `REST API getTruckUtilByItem result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving truck utility by item: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving truck utility data: ${error.message}`,
      };
    }
  }
}
