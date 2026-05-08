import { ApiProperty } from '@nestjs/swagger';

export class OntBranchesDto {
  @ApiProperty({ example: 204, required: false })
  ORG_ID?: number;

  @ApiProperty({ example: 'NNA_PMK_OU', required: false })
  ORG_CODE?: string;

  @ApiProperty({ example: 'Jakarta Branch', required: false })
  ORG_NAME?: string;
}

export class OntBranchesResponseDto {
  @ApiProperty({ type: [OntBranchesDto] })
  data: OntBranchesDto[];

  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({ example: 'ONT branches retrieved successfully' })
  message: string;
}
