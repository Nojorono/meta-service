import { ApiProperty } from '@nestjs/swagger';

export class CurrencyDto {
  @ApiProperty({
    description: 'Currency code',
    example: 'ADP',
  })
  CURRENCY_CODE: string;

  @ApiProperty({
    description: 'Currency name',
    example: 'Andorran Peseta',
  })
  NAME: string;

  @ApiProperty({
    description: 'Enabled flag',
    example: 'X',
  })
  ENABLED_FLAG: string;

  @ApiProperty({
    description: 'Start date active',
    example: '2000-01-01',
    required: false,
  })
  START_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'End date active',
    example: '2030-12-31',
    required: false,
  })
  END_DATE_ACTIVE?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2004-06-24 00:00:00.000',
    required: false,
  })
  LAST_UPDATE_DATE?: string;
}

export class CurrencyQueryDto {
  @ApiProperty({
    description: 'Currency code to filter by',
    example: 'ADP',
    required: false,
  })
  CURRENCY_CODE?: string;

  @ApiProperty({
    description: 'Currency name to filter by',
    example: 'Andorran Peseta',
    required: false,
  })
  NAME?: string;

  @ApiProperty({
    description: 'Enabled flag to filter by',
    example: 'X',
    required: false,
  })
  ENABLED_FLAG?: string;

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
