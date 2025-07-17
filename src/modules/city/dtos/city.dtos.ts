import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty({
    description: 'City code',
    example: 'JKT01',
  })
  KOTAMADYA_CODE: string;

  @ApiProperty({
    description: 'City name',
    example: 'Jakarta Selatan',
  })
  KOTAMADYA: string;

  @ApiProperty({
    description: 'City enabled flag',
    example: 'Y',
  })
  KOTAMADYA_ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Province code',
    example: 'JKT',
  })
  PROVINSI_CODE: string;

  @ApiProperty({
    description: 'City start date',
    example: '2020-01-01',
    required: false,
  })
  KOTAMADYA_START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'City end date',
    example: '2030-12-31',
    required: false,
  })
  KOTAMADYA_END_DATE_ACTIVE?: string;
}

export class CityQueryDto {
  @ApiProperty({
    description: 'City code to filter by',
    example: 'JKT01',
    required: false,
  })
  KOTAMADYA_CODE?: string;

  @ApiProperty({
    description: 'City name to filter by',
    example: 'Jakarta',
    required: false,
  })
  KOTAMADYA?: string;

  @ApiProperty({
    description: 'Province code to filter by',
    example: 'JKT',
    required: false,
  })
  PROVINSI_CODE?: string;

  @ApiProperty({
    description: 'Page number for pagination',
    example: 1,
    required: false,
  })
  PAGE?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  LIMIT?: number;
}
