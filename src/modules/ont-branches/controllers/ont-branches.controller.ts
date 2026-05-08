import { Controller, Get, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { AuthSwagger } from 'src/decorators/auth-swagger.decorator';
import { OntBranchesResponseDto } from '../dtos/ont-branches.dtos';
import { OntBranchesService } from '../services/ont-branches.service';

@ApiTags('ONT Branches')
@Public()
@AuthSwagger()
@Controller('ont-branches')
export class OntBranchesController {
  private readonly logger = new Logger(OntBranchesController.name);

  constructor(private readonly ontBranchesService: OntBranchesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all ONT branches',
    description: 'Retrieve all records from APPS.XTD_ONT_BRANCHES_V',
  })
  @ApiResponse({
    status: 200,
    description: 'ONT branches retrieved successfully',
    type: OntBranchesResponseDto,
  })
  async findAll(): Promise<OntBranchesResponseDto> {
    try {
      return await this.ontBranchesService.findAll();
    } catch (error) {
      this.logger.error('Failed to fetch ONT branches', error.stack);
      throw new HttpException(
        'Failed to fetch ONT branches',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
