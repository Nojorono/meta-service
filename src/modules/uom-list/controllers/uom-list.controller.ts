import { Controller, Get, Query, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UomListService } from '../uom-list.service';
import {
  MetaUomListDtoByUomCode,
  MetaUomListResponseDto,
} from '../dto/uom-list.dtos';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';

@ApiTags('UOM List Meta')
@Controller('uom-list')
@AuthSwagger()
export class UomListController {
  private readonly logger = new Logger(UomListController.name);

  constructor(private readonly uomListService: UomListService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all UOM lists',
    description: 'Retrieve all Unit of Measure lists from Oracle database',
  })
  @ApiResponse({
    status: 200,
    description: 'UOM lists retrieved successfully',
    type: MetaUomListResponseDto,
  })
  async getUomList(): Promise<MetaUomListResponseDto> {
    this.logger.log('==== REST API: Get all UOM lists ====');

    try {
      const result =
        await this.uomListService.getUomListFromOracleByUomCode();
      this.logger.log(
        `REST API getUomList result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving UOM lists: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving UOM lists data: ${error.message}`,
      };
    }
  }

  @Get('by-uom-code')
  @ApiOperation({
    summary: 'Get UOM list by UOM code',
    description: 'Retrieve UOM list filtered by UOM code',
  })
  @ApiQuery({
    name: 'UOM_CODE',
    required: true,
    type: String,
    description: 'Filter UOM lists by UOM code',
    example: 'KG',
  })
  @ApiResponse({
    status: 200,
    description: 'UOM list retrieved successfully',
    type: MetaUomListResponseDto,
  })
  async getUomListByUomCode(
    @Query('UOM_CODE') uomCode: string,
  ): Promise<MetaUomListResponseDto> {
    this.logger.log('==== REST API: Get UOM lists by UOM code ====');
    this.logger.log(`UOM Code filter: ${uomCode}`);

    try {
      const params: MetaUomListDtoByUomCode = { UOM_CODE: uomCode };
      const result =
        await this.uomListService.getUomListFromOracleByUomCode(params);
      this.logger.log(
        `REST API getUomListByUomCode result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `REST API Error retrieving UOM list by UOM code: ${error.message}`,
        error.stack,
      );
      return {
        data: [],
        count: 0,
        status: false,
        message: `Error retrieving UOM list data: ${error.message}`,
      };
    }
  }
}
