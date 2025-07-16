import { ApiProperty } from '@nestjs/swagger';

export class PositionDto {
  @ApiProperty({
    description: 'Position ID',
    example: 1001,
  })
  POSITION_ID: number;

  @ApiProperty({
    description: 'Position code',
    example: 'POS001',
  })
  POSITION_CODE: string;

  @ApiProperty({
    description: 'Position name',
    example: 'Sales Manager',
  })
  POSITION_NAME: string;

  @ApiProperty({
    description: 'Position title',
    example: 'Manager',
  })
  POSITION_TITLE: string;

  @ApiProperty({
    description: 'Position level',
    example: 'MANAGER',
  })
  POSITION_LEVEL: string;

  @ApiProperty({
    description: 'Position group',
    example: 'SALES',
  })
  POSITION_GROUP: string;

  @ApiProperty({
    description: 'Organization ID',
    example: 101,
  })
  ORGANIZATION_ID: number;

  @ApiProperty({
    description: 'Position enabled flag',
    example: 'Y',
  })
  ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Position start date',
    example: '2020-01-01',
    required: false,
  })
  START_DATE?: string;

  @ApiProperty({
    description: 'Position end date',
    example: '2030-12-31',
    required: false,
  })
  END_DATE?: string;

  @ApiProperty({
    description: 'Job description',
    example: 'Manage sales team and achieve targets',
    required: false,
  })
  JOB_DESCRIPTION?: string;
}

export class PositionQueryDto {
  @ApiProperty({
    description: 'Position code to filter by',
    example: 'POS001',
    required: false,
  })
  positionCode?: string;

  @ApiProperty({
    description: 'Position name to filter by',
    example: 'Manager',
    required: false,
  })
  positionName?: string;

  @ApiProperty({
    description: 'Position level to filter by',
    example: 'MANAGER',
    required: false,
  })
  positionLevel?: string;

  @ApiProperty({
    description: 'Position group to filter by',
    example: 'SALES',
    required: false,
  })
  positionGroup?: string;

  @ApiProperty({
    description: 'Organization ID to filter by',
    example: 101,
    required: false,
  })
  organizationId?: number;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  limit?: number;
}
