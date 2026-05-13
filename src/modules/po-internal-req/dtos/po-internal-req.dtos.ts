import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { CreatePoInternalReqLinesDto } from './po-internal-req-lines.dtos';

export class CreatePoInternalReqDto {
  @ApiProperty({ example: 'Outbound GS Mutasi SO Internal' })
  @IsString()
  TRANSACTION_TYPE: string;

  @ApiProperty({ example: 'WMS' })
  @IsString()
  SOURCE_CODE: string;

  @ApiProperty({ example: 'HDR-2026-0001' })
  @IsString()
  SOURCE_HEADER_ID: string;

  @ApiProperty({
    example: '2026-05-06',
    description:
      'Date only (YYYY-MM-DD) or ISO-8601; first 10 characters are used for NEED_BY_DATE',
  })
  @IsDateString()
  NEED_BY_DATE: string;

  @ApiProperty({ example: '1' })
  @IsString()
  PREPARER_NUMBER: string;

  @ApiProperty({ example: '1001', required: false, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  PREPARER_ID?: string;

  @ApiProperty({ example: 'EMP002' })
  @IsString()
  REQUESTOR_NUMBER: string;

  @ApiProperty({ example: '1002', required: false, maxLength: 30 })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  REQUESTOR_ID?: string;

  @ApiProperty({ example: 'MAIN OU' })
  @IsString()
  ORG_NAME: string;

  @ApiProperty({ example: 204, required: false })
  @IsOptional()
  @IsNumber()
  ORG_ID?: number;

  @ApiProperty({ example: 'WH SOURCE' })
  @IsString()
  IO_SOURCE_NAME: string;

  @ApiProperty({ example: 3001, required: false })
  @IsOptional()
  @IsNumber()
  IO_SOURCE_ID?: number;

  @ApiProperty({ example: 'WH DEST' })
  @IsString()
  IO_DEST_NAME: string;

  @ApiProperty({ example: 3002, required: false })
  @IsOptional()
  @IsNumber()
  IO_DEST_ID?: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  TOTAL_LINES: number;

  @ApiProperty({ example: 'WMS-INT-REQ' })
  @IsString()
  HEADER_ATTRIBUTE_CATEGORY: string;

  @ApiProperty({ example: 'batch-001' })
  @IsString()
  HEADER_ATTRIBUTE7: string;

  @ApiProperty({ type: [CreatePoInternalReqLinesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePoInternalReqLinesDto)
  LINES: CreatePoInternalReqLinesDto[];
}

export class PoInternalReqResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({
    example: 'PO internal requisition interface data inserted successfully',
  })
  message: string;

  @ApiProperty({
    example: [
      {
        SOURCE_HEADER_ID: 'HDR-2026-0001',
        TOTAL_LINES: 2,
        INSERTED_LINES: 2,
      },
    ],
    nullable: true,
  })
  data: any;
}
