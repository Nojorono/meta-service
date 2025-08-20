import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class SummaryFpprDto {
  @ApiProperty({ description: 'Summary ID', example: 2 })
  @IsOptional()
  @IsNumber()
  SUMMARY_ID?: number;

  @ApiProperty({ description: 'FPPR ID', example: 102 })
  @IsOptional()
  @IsNumber()
  FPPR_ID?: number;

  @ApiProperty({ description: 'FPPR number', example: 'AT/CP/2024/02/00002' })
  @IsOptional()
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'Cash sales amount', example: 6200000 })
  @IsOptional()
  @IsNumber()
  CASH_SALES_AMOUNT?: number;

  @ApiProperty({ description: 'Transfer sales amount', example: 3100000 })
  @IsOptional()
  @IsNumber()
  TRANSFER_SALES_AMOUNT?: number;

  @ApiProperty({ description: 'Giro sales amount', example: 1800000 })
  @IsOptional()
  @IsNumber()
  GIRO_SALES_AMOUNT?: number;

  @ApiProperty({ description: 'Credit sales amount', example: 1200000 })
  @IsOptional()
  @IsNumber()
  CREDIT_SALES_AMOUNT?: number;

  @ApiProperty({ description: 'Cash collect amount', example: 6000000 })
  @IsOptional()
  @IsNumber()
  CASH_COLLECT_AMOUNT?: number;

  @ApiProperty({ description: 'Transfer collect amount', example: 3000000 })
  @IsOptional()
  @IsNumber()
  TRANSFER_COLLECT_AMOUNT?: number;

  @ApiProperty({ description: 'Return sales amount', example: 300000 })
  @IsOptional()
  @IsNumber()
  RETURN_SALES_AMOUNT?: number;

  @ApiProperty({ description: 'Deposit amount', example: 600000 })
  @IsOptional()
  @IsNumber()
  DEPOSIT_AMOUNT?: number;

  @ApiProperty({ description: 'Operation cost amount', example: 1500000 })
  @IsOptional()
  @IsNumber()
  OPERATION_COST_AMOUNT?: number;

  @ApiProperty({ description: 'BTU amount', example: 350 })
  @IsOptional()
  @IsNumber()
  BTU_AMOUNT?: number;

  @ApiProperty({ description: 'Collect total amount', example: 9000000 })
  @IsOptional()
  @IsNumber()
  COLLECT_TOTAL_AMOUNT?: number;

  @ApiProperty({ description: 'Cash total amount', example: 12100000 })
  @IsOptional()
  @IsNumber()
  CASH_TOTAL_AMOUNT?: number;

  @ApiProperty({ description: 'Sales total amount', example: 12300000 })
  @IsOptional()
  @IsNumber()
  SALES_TOTAL_AMOUNT?: number;

  @ApiProperty({
    description: 'Description',
    example: 'Total Penjualan Bulan Februari',
  })
  @IsOptional()
  @IsString()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Attribute category', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE_CATEGORY?: string;

  @ApiProperty({ description: 'Attribute 1', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE1?: string;

  @ApiProperty({ description: 'Attribute 2', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE2?: string;

  @ApiProperty({ description: 'Attribute 3', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE3?: string;

  @ApiProperty({ description: 'Attribute 4', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE4?: string;

  @ApiProperty({ description: 'Attribute 5', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE5?: string;

  @ApiProperty({ description: 'Attribute 6', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE6?: string;

  @ApiProperty({ description: 'Attribute 7', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE7?: string;

  @ApiProperty({ description: 'Attribute 8', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE8?: string;

  @ApiProperty({ description: 'Attribute 9', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE9?: string;

  @ApiProperty({ description: 'Attribute 10', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE10?: string;

  @ApiProperty({ description: 'Attribute 11', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE11?: string;

  @ApiProperty({ description: 'Attribute 12', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE12?: string;

  @ApiProperty({ description: 'Attribute 13', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE13?: string;

  @ApiProperty({ description: 'Attribute 14', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE14?: string;

  @ApiProperty({ description: 'Attribute 15', example: '' })
  @IsOptional()
  @IsString()
  ATTRIBUTE15?: string;

  @ApiProperty({ description: 'Source system', example: 'DMS' })
  @IsOptional()
  @IsString()
  SOURCE_SYSTEM?: string;

  @ApiProperty({ description: 'Source batch ID', example: '1234567891' })
  @IsOptional()
  @IsString()
  SOURCE_BATCH_ID?: string;

  @ApiProperty({ description: 'Source header ID', example: '1234567891' })
  @IsOptional()
  @IsString()
  SOURCE_HEADER_ID?: string;

  @ApiProperty({ description: 'Source line ID', example: '1234567891' })
  @IsOptional()
  @IsString()
  SOURCE_LINE_ID?: string;

  @ApiProperty({ description: 'Request ID', example: 2 })
  @IsOptional()
  @IsNumber()
  REQUEST_ID?: number;

  @ApiProperty({
    description: 'Creation date',
    example: '2025-07-23T16:33:55.000Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  CREATION_DATE?: Date;

  @ApiProperty({ description: 'Created by', example: '1234' })
  @IsOptional()
  @IsString()
  CREATED_BY?: string;

  @ApiProperty({ description: 'Last update login', example: 1234 })
  @IsOptional()
  @IsNumber()
  LAST_UPDATE_LOGIN?: number;

  @ApiProperty({
    description: 'Last update date',
    example: '2025-07-23T16:33:55.000Z',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  LAST_UPDATE_DATE?: Date;

  @ApiProperty({ description: 'Last updated by', example: '1234' })
  @IsOptional()
  @IsString()
  LAST_UPDATED_BY?: string;
}

export class SummaryFpprQueryDto {
  @ApiProperty({ description: 'Summary ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  SUMMARY_ID?: number;

  @ApiProperty({ description: 'FPPR ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  FPPR_ID?: number;

  @ApiProperty({ description: 'FPPR number', required: false })
  @IsOptional()
  @IsString()
  FPPR_NUMBER?: string;

  @ApiProperty({ description: 'Description', required: false })
  @IsOptional()
  @IsString()
  DESCRIPTION?: string;

  @ApiProperty({ description: 'Source system', required: false })
  @IsOptional()
  @IsString()
  SOURCE_SYSTEM?: string;

  @ApiProperty({ description: 'Page number', required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false, example: 10 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
