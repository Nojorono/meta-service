import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export enum ShipConfirmInternalTransactionType {
  OUTBOUND_GS_MUTASI_SO_INTERNAL = 'Outbound GS Mutasi SO Internal',
  OUTBOUND_GS_SO_SUBDIST_PICK_RELEASE = 'Outbound GS SO Subdist Pick Release',
  OUTBOUND_GS_SO_SUBDIST_SHIP_CONFIRM = 'Outbound GS SO Subdist Ship Confirm',
}

export class CreateShipConfirmPickReleaseLineDto {
  @ApiProperty({ example: 'LINE-2026-0001' })
  @IsString()
  @MaxLength(100)
  SOURCE_LINE_ID: string;

  @ApiProperty({ example: 12345 })
  @IsNumber()
  ISO_HEADER_ID: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  ISO_LINE_ID: number;

  @ApiProperty({ example: 987654 })
  @IsNumber()
  ISO_INVENTORY_ITEM_ID: number;

  @ApiProperty({ example: 204 })
  @IsNumber()
  ISO_ORGANIZATION_ID: number;

  // --- Type 3: Outbound GS SO Subdist Ship Confirm ---
  @ApiProperty({ example: 50001, required: false })
  @IsNotEmpty()
  @IsNumber()
  DELIVERY_ID?: number;

  @ApiProperty({ example: 'DEL-2026-0001', required: false })
  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  DELIVERY_NAME?: string;

  @ApiProperty({ example: 25, required: false })
  @IsNotEmpty()
  @IsNumber()
  SHIPPED_QUANTITY?: number;
}

export class CreateShipConfirmInternalDto {
  @ApiProperty({
    enum: ShipConfirmInternalTransactionType,
    example: ShipConfirmInternalTransactionType.OUTBOUND_GS_MUTASI_SO_INTERNAL,
  })
  @IsEnum(ShipConfirmInternalTransactionType)
  TRANSACTION_TYPE: ShipConfirmInternalTransactionType;

  @ApiProperty({ example: 'WMS' })
  @IsString()
  @MaxLength(100)
  SOURCE_SYSTEM: string;

  @ApiProperty({ example: 'HDR-2026-0001' })
  @IsString()
  @MaxLength(100)
  SOURCE_HEADER_ID: string;

  // --- Type 1: Outbound GS Mutasi SO Internal ---
  @ApiProperty({ example: 12345, required: false })
  @IsNotEmpty()
  @IsNumber()
  ISO_HEADER_ID?: number;

  @ApiProperty({ example: 'WMS-SHIP-CONFIRM', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE_CATEGORY?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE6?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE7?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE8?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE9?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE10?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE11?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE12?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE13?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE14?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  DELIVERY_ATTRIBUTE15?: string;

  // --- Type 2: Outbound GS SO Subdist Pick Release ---
  @ApiProperty({ type: [CreateShipConfirmPickReleaseLineDto], required: false })
  @Type(() => CreateShipConfirmPickReleaseLineDto)
  LINES?: CreateShipConfirmPickReleaseLineDto[];

  // --- Type 3: Outbound GS SO Subdist Ship Confirm (flat single-line payload) ---
  @ApiProperty({ example: 50001, required: false })
  @IsOptional()
  @IsNumber()
  DELIVERY_ID?: number;

  @ApiProperty({ example: 'DEL-2026-0001', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  DELIVERY_NAME?: string;

  @ApiProperty({ example: 25, required: false })
  @IsOptional()
  @IsNumber()
  SHIPPED_QUANTITY?: number;
}

export class ShipConfirmInternalFindDto {
  @ApiProperty({ example: 'HDR-2026-0001', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  source_header_id?: string;

  @ApiProperty({ example: 12345, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  iso_header_id?: number;

  @ApiProperty({
    enum: ShipConfirmInternalTransactionType,
    required: false,
    example: ShipConfirmInternalTransactionType.OUTBOUND_GS_MUTASI_SO_INTERNAL,
  })
  @IsOptional()
  @IsEnum(ShipConfirmInternalTransactionType)
  transaction_type?: ShipConfirmInternalTransactionType;
}

export class ShipConfirmInternalResponseDto {
  @ApiProperty({ example: true })
  status: boolean;

  @ApiProperty({
    example: 'Ship confirm internal interface data inserted successfully',
  })
  message: string;

  @ApiProperty({ nullable: true })
  data: any;
}
