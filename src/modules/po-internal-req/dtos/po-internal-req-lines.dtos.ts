import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreatePoInternalReqLinesDto {
  @ApiProperty({ example: 'HDR-2026-0001' })
  @IsString()
  SOURCE_HEADER_ID: string;

  @ApiProperty({ example: 'LINE-2026-0001' })
  @IsString()
  SOURCE_LINE_ID: string;

  @ApiProperty({ example: 123456 })
  @IsNumber()
  INVENTORY_ITEM_ID: number;

  @ApiProperty({ example: 'ITEM-CODE-001' })
  @IsString()
  ITEM: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  QUANTITY: number;

  @ApiProperty({ example: 'PCS' })
  @IsString()
  TRANSACTION_UOM: string;
}
