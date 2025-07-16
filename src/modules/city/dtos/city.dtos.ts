import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({
    description: 'Province code',
    example: 'JKT',
  })
  PROVINSI_CODE: string;

  @ApiProperty({
    description: 'City code',
    example: 'JKT01',
  })
  KOTAMADYA_CODE: string;

  @ApiProperty({
    description: 'City name',
    example: 'Jakarta Selatan',
  })
  KOTAMADYA_NAME: string;

  @ApiProperty({
    description: 'City enabled flag',
    example: 'Y',
  })
  KOTAMADYA_ENABLED_FLAG: string;

  @ApiProperty({
    description: 'City start date',
    example: '2020-01-01',
    required: false,
  })
  KOTAMADYA_START_DATE?: string;

  @ApiProperty({
    description: 'City end date',
    example: '2030-12-31',
    required: false,
  })
  KOTAMADYA_END_DATE?: string;
}

export class CityQueryDto {
  @ApiProperty({
    description: 'Province code to filter by',
    example: 'JKT',
    required: false,
  })
  provinsiCode?: string;

  @ApiProperty({
    description: 'City code to filter by',
    example: 'JKT01',
    required: false,
  })
  kotamadyaCode?: string;

  @ApiProperty({
    description: 'City name to filter by',
    example: 'Jakarta',
    required: false,
  })
  kotamadyaName?: string;

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
