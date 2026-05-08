import { Injectable, Logger } from '@nestjs/common';
import { OracleService } from 'src/common/services/oracle.service';
import {
  OntBranchesDto,
  OntBranchesResponseDto,
} from '../dtos/ont-branches.dtos';

@Injectable()
export class OntBranchesService {
  private readonly logger = new Logger(OntBranchesService.name);

  constructor(private readonly oracleService: OracleService) {}

  async findAll(): Promise<OntBranchesResponseDto> {
    try {
      const query = `
        SELECT *
        FROM APPS.XTD_ONT_BRANCHES_V
      `;

      const result = await this.oracleService.executeQuery(query, []);
      const rows = (result.rows || []) as OntBranchesDto[];

      return {
        data: rows,
        count: rows.length,
        status: true,
        message: 'ONT branches retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Error retrieving ONT branches:', error);
      throw error;
    }
  }
}
