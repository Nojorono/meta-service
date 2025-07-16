import { ApiProperty } from '@nestjs/swagger';

export class SubDistrictDto {
  @ApiProperty({
    description: 'District code',
    example: 'JKT0101',
  })
  KECAMATAN_CODE: string;

  @ApiProperty({
    description: 'Sub-district code',
    example: 'JKT010101',
  })
  KELURAHAN_CODE: string;

  @ApiProperty({
    description: 'Sub-district name',
    example: 'Gondangdia',
  })
  KELURAHAN_NAME: string;

  @ApiProperty({
    description: 'Sub-district enabled flag',
    example: 'Y',
  })
  KELURAHAN_ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Sub-district start date',
    example: '2020-01-01',
    required: false,
  })
  KELURAHAN_START_DATE?: string;

  @ApiProperty({
    description: 'Sub-district end date',
    example: '2030-12-31',
    required: false,
  })
  KELURAHAN_END_DATE?: string;
}

export class SubDistrictQueryDto {
  @ApiProperty({
    description: 'District code to filter by',
    example: 'JKT0101',
    required: false,
  })
  kecamatanCode?: string;

  @ApiProperty({
    description: 'Sub-district code to filter by',
    example: 'JKT010101',
    required: false,
  })
  kelurahanCode?: string;

  @ApiProperty({
    description: 'Sub-district name to filter by',
    example: 'Gondangdia',
    required: false,
  })
  kelurahanName?: string;

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
