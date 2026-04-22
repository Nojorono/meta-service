import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { CreateRcvReceiptLinesDto } from './rcv-receipt-lines.dtos';
import { Type } from 'class-transformer';

export enum RcvReceiptTransactionType {
  INBOUND_GS_MUTASI_SO_INTERNAL = 'Inbound GS Mutasi SO Internal',
  INBOUND_GS_PRINCIPAL = 'Inbound GS Principal',
  ADD_TO_RECEIPT = 'Add to Receipt',
}

export enum RcvReceiptSourceCode {
  INTERNAL_ORDER = 'INTERNAL ORDER',
  VENDOR = 'VENDOR',
}

export class CreateRcvReceiptDto {
  @ApiProperty({
    enum: RcvReceiptTransactionType,
    example: RcvReceiptTransactionType.INBOUND_GS_PRINCIPAL,
  })
  @IsEnum(RcvReceiptTransactionType)
  TRANSACTION_TYPE: string;

  @ApiProperty({ example: 'WMS' })
  @IsString()
  SOURCE_SYSTEM: string;

  @ApiProperty({
    enum: RcvReceiptSourceCode,
    example: RcvReceiptSourceCode.INTERNAL_ORDER,
  })
  @IsEnum(RcvReceiptSourceCode)
  RECEIPT_SOURCE_CODE: string;

  @ApiProperty({ example: 'DO-2026-0001' })
  @IsString()
  SOURCE_HEADER_ID: string;

  @ApiProperty({ example: 'DO000123', required: false })
  @IsOptional()
  @IsString()
  DO_NUMBER?: string;

  @ApiProperty({ example: 1001 })
  @IsOptional()
  @IsNumber()
  VENDOR_ID: number;

  @ApiProperty({ example: 2001 })
  @IsOptional()
  @IsNumber()
  VENDOR_SITE_ID: number;

  @ApiProperty({ example: 'B1234CD', required: false })
  @IsOptional()
  @IsString()
  RSH_ATTRIBUTE1?: string;

  @ApiProperty({ example: 'John Driver', required: false })
  @IsOptional()
  @IsString()
  RSH_ATTRIBUTE2?: string;

  @ApiProperty({ example: 'Ekspedisi Maju', required: false })
  @IsOptional()
  @IsString()
  RSH_ATTRIBUTE3?: string;

  @ApiProperty({ example: 'RCV26040001' })
  @IsOptional()
  @IsString()
  RECEIPT_NUMBER: string;

  @ApiProperty({ example: 3 })
  @IsNumber()
  TOTAL_LINES: number;

  @ApiProperty({ type: [CreateRcvReceiptLinesDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRcvReceiptLinesDto)
  LINES: CreateRcvReceiptLinesDto[];
}

export class RcvReceiptResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({
    example: 'Receipt header interface data inserted successfully',
  })
  message: string;

  @ApiProperty({
    example: {
      SOURCE_HEADER_ID: 'DO-2026-0001',
      TOTAL_LINES: 3,
      INSERTED_LINES: 3,
    },
    nullable: true,
  })
  data: any;
}
