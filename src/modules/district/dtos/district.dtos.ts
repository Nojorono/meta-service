import { ApiProperty } from '@nestjs/swagger';

export class DistrictDto {
  @ApiProperty({
    description: 'City code',
    example: 'JKT01',
  })
  KOTAMADYA_CODE: string;

  @ApiProperty({
    description: 'District code',
    example: 'JKT0101',
  })
  KECAMATAN_CODE: string;

  @ApiProperty({
    description: 'District name',
    example: 'Menteng',
  })
  KECAMATAN_NAME: string;

  @ApiProperty({
    description: 'District enabled flag',
    example: 'Y',
  })
  KECAMATAN_ENABLED_FLAG: string;

  @ApiProperty({
    description: 'District start date',
    example: '2020-01-01',
    required: false,
  })
  KECAMATAN_START_DATE?: string;

  @ApiProperty({
    description: 'District end date',
    example: '2030-12-31',
    required: false,
  })
  KECAMATAN_END_DATE?: string;
}

export class DistrictQueryDto {
  @ApiProperty({
    description: 'City code to filter by',
    example: 'JKT01',
    required: false,
  })
  kotamadyaCode?: string;

  @ApiProperty({
    description: 'District code to filter by',
    example: 'JKT0101',
    required: false,
  })
  kecamatanCode?: string;

  @ApiProperty({
    description: 'District name to filter by',
    example: 'Menteng',
    required: false,
  })
  kecamatanName?: string;

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
