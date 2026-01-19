import {
  Controller,
  Get,
  Query,
  Param,
  HttpException,
  HttpStatus,
  Logger,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { AuthSwagger } from '../../../decorators/auth-swagger.decorator';
import { PoLineService } from '../services/po-line.service';
import { PoLineDto, PoLineQueryDto } from '../dtos/po-line.dtos';

@ApiTags('PO Line')
@Controller('po-line')
@AuthSwagger()
export class PoLineController {
  private readonly logger = new Logger(PoLineController.name);

  constructor(private readonly poLineService: PoLineService) { }

  @Get()
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get all PO lines',
    description:
      'Retrieve a list of PO lines from PO tables filtered by vendor_id, where prha.attribute7 = YES, pla.attribute7 IS NULL, and quantity_received = 0',
  })
  @ApiQuery({
    name: 'vendor_id',
    required: true,
    description: 'Filter by vendor ID',
    example: 1001,
  })
  @ApiQuery({
    name: 'segment1',
    required: false,
    description: 'Filter by PO segment 1 (PO Number)',
    example: 'PO-2024-001',
  })
  @ApiQuery({
    name: 'item_description',
    required: false,
    description: 'Filter by item description',
    example: 'Laptop',
  })
  @ApiQuery({
    name: 'po_line_id',
    required: false,
    description: 'Filter by PO line ID',
    example: 12345,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of records per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of PO lines retrieved successfully',
    type: [PoLineDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - vendor_id is required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findAllPoLines(
    @Query() queryDto: PoLineQueryDto,
  ): Promise<PoLineDto[]> {
    try {
      if (!queryDto.vendor_id) {
        throw new HttpException(
          'vendor_id is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log('Fetching all PO lines with filters:', queryDto);
      return await this.poLineService.findAllPoLines(queryDto);
    } catch (error) {
      this.logger.error('Error fetching PO lines:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch PO lines',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('count')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get PO line count',
    description:
      'Get the total count of PO lines matching the filter criteria',
  })
  @ApiQuery({
    name: 'vendor_id',
    required: true,
    description: 'Filter by vendor ID',
    example: 1001,
  })
  @ApiQuery({
    name: 'segment1',
    required: false,
    description: 'Filter by PO segment 1 (PO Number)',
    example: 'PO-2024-001',
  })
  @ApiQuery({
    name: 'item_description',
    required: false,
    description: 'Filter by item description',
    example: 'Laptop',
  })
  @ApiQuery({
    name: 'po_line_id',
    required: false,
    description: 'Filter by PO line ID',
    example: 12345,
  })
  @ApiResponse({
    status: 200,
    description: 'PO line count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 50 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - vendor_id is required',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async getPoLineCount(
    @Query() queryDto: PoLineQueryDto,
  ): Promise<{ count: number }> {
    try {
      if (!queryDto.vendor_id) {
        throw new HttpException(
          'vendor_id is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log('Getting PO line count with filters:', queryDto);
      const count = await this.poLineService.getPoLineCount(queryDto);
      return { count };
    } catch (error) {
      this.logger.error('Error getting PO line count:', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to get PO line count',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @AuthSwagger()
  @ApiOperation({
    summary: 'Get PO line by ID',
    description:
      'Retrieve a specific PO line by its ID and vendor_id from PO tables',
  })
  @ApiParam({
    name: 'id',
    description: 'PO Line ID',
    example: 12345,
  })
  @ApiQuery({
    name: 'vendor_id',
    required: true,
    description: 'Vendor ID',
    example: 1001,
  })
  @ApiResponse({
    status: 200,
    description: 'PO line retrieved successfully',
    type: PoLineDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - vendor_id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'PO line not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  async findPoLineById(
    @Param('id', ParseIntPipe) id: number,
    @Query('vendor_id', ParseIntPipe) vendorId: number,
  ): Promise<PoLineDto> {
    try {
      this.logger.log(`Fetching PO line by ID: ${id} for vendor: ${vendorId}`);
      const poLine = await this.poLineService.findPoLineById(id, vendorId);

      if (!poLine) {
        throw new HttpException(
          `PO line with ID ${id} not found for vendor ${vendorId}`,
          HttpStatus.NOT_FOUND,
        );
      }

      return poLine;
    } catch (error) {
      this.logger.error(`Error fetching PO line by ID ${id}:`, error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Failed to fetch PO line',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
