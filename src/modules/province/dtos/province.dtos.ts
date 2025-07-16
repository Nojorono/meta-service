import { ApiProperty } from '@nestjs/swagger';

export class ProvinceDto {
  @ApiProperty({
    description: 'Province code',
    example: 'JKT',
  })
  PROVINSI_CODE: string;

  @ApiProperty({
    description: 'Province name',
    example: 'DKI Jakarta',
  })
  PROVINSI_NAME: string;

  @ApiProperty({
    description: 'Province enabled flag',
    example: 'Y',
  })
  PROVINSI_ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Province start date',
    example: '2020-01-01',
    required: false,
  })
  PROVINSI_START_DATE?: string;

  @ApiProperty({
    description: 'Province end date',
    example: '2030-12-31',
    required: false,
  })
  PROVINSI_END_DATE?: string;
}

export class ProvinceQueryDto {
  @ApiProperty({
    description: 'Province code to filter by',
    example: 'JKT',
    required: false,
  })
  provinsiCode?: string;

  @ApiProperty({
    description: 'Province name to filter by',
    example: 'Jakarta',
    required: false,
  })
  provinsiName?: string;

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
