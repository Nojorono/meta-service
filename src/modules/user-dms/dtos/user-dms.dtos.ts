import { ApiProperty } from '@nestjs/swagger';

export class UserDmsDto {
  @ApiProperty({
    description: 'User name',
    example: 'DMS',
  })
  USER_NAME: string;

  @ApiProperty({
    description: 'User ID',
    example: 1271,
  })
  USER_ID: number;

  @ApiProperty({
    description: 'Start date',
    example: '2000-01-01 00:00:00.000',
    required: false,
  })
  START_DATE?: string;

  @ApiProperty({
    description: 'End date',
    example: '2030-12-31',
    required: false,
  })
  END_DATE?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-05-22 14:59:41.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;

  @ApiProperty({
    description: 'Description',
    example: 'System Administrator User',
    required: false,
  })
  DESCRIPTION?: string;
}

export class UserDmsQueryDto {
  @ApiProperty({
    description: 'User name to filter by',
    example: 'DMS',
    required: false,
  })
  userName?: string;

  @ApiProperty({
    description: 'Description to filter by',
    example: 'System Administrator User',
    required: false,
  })
  description?: string;

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
