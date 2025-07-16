import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ArOutstandingsDto {
  @ApiProperty({ description: 'Customer ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  CUSTOMER_ID?: number;

  @ApiProperty({ description: 'Customer number', example: 'CUST001' })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER?: string;

  @ApiProperty({ description: 'Customer name', example: 'PT. Customer Name' })
  @IsOptional()
  @IsString()
  CUSTOMER_NAME?: string;

  @ApiProperty({ description: 'Payment schedule ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  PAYMENT_SCHEDULE_ID?: number;

  @ApiProperty({ description: 'Invoice number', example: 'INV001' })
  @IsOptional()
  @IsString()
  INVOICE_NUMBER?: string;

  @ApiProperty({ description: 'Invoice date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  INVOICE_DATE?: Date;

  @ApiProperty({ description: 'Due date', example: '2023-01-31' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DUE_DATE?: Date;

  @ApiProperty({ description: 'Amount due original', example: 1000000 })
  @IsOptional()
  @IsNumber()
  AMOUNT_DUE_ORIGINAL?: number;

  @ApiProperty({ description: 'Amount due remaining', example: 500000 })
  @IsOptional()
  @IsNumber()
  AMOUNT_DUE_REMAINING?: number;

  @ApiProperty({ description: 'Amount applied', example: 500000 })
  @IsOptional()
  @IsNumber()
  AMOUNT_APPLIED?: number;

  @ApiProperty({ description: 'Amount credited', example: 0 })
  @IsOptional()
  @IsNumber()
  AMOUNT_CREDITED?: number;

  @ApiProperty({ description: 'Amount adjusted', example: 0 })
  @IsOptional()
  @IsNumber()
  AMOUNT_ADJUSTED?: number;

  @ApiProperty({ description: 'Amount line items original', example: 1000000 })
  @IsOptional()
  @IsNumber()
  AMOUNT_LINE_ITEMS_ORIGINAL?: number;

  @ApiProperty({ description: 'Amount line items remaining', example: 500000 })
  @IsOptional()
  @IsNumber()
  AMOUNT_LINE_ITEMS_REMAINING?: number;

  @ApiProperty({ description: 'Tax original', example: 110000 })
  @IsOptional()
  @IsNumber()
  TAX_ORIGINAL?: number;

  @ApiProperty({ description: 'Tax remaining', example: 55000 })
  @IsOptional()
  @IsNumber()
  TAX_REMAINING?: number;

  @ApiProperty({ description: 'Freight original', example: 50000 })
  @IsOptional()
  @IsNumber()
  FREIGHT_ORIGINAL?: number;

  @ApiProperty({ description: 'Freight remaining', example: 25000 })
  @IsOptional()
  @IsNumber()
  FREIGHT_REMAINING?: number;

  @ApiProperty({ description: 'Receivables charges charged', example: 0 })
  @IsOptional()
  @IsNumber()
  RECEIVABLES_CHARGES_CHARGED?: number;

  @ApiProperty({ description: 'Receivables charges remaining', example: 0 })
  @IsOptional()
  @IsNumber()
  RECEIVABLES_CHARGES_REMAINING?: number;

  @ApiProperty({ description: 'Discount taken earned', example: 0 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_TAKEN_EARNED?: number;

  @ApiProperty({ description: 'Discount taken unearned', example: 0 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_TAKEN_UNEARNED?: number;

  @ApiProperty({ description: 'Currency code', example: 'IDR' })
  @IsOptional()
  @IsString()
  CURRENCY_CODE?: string;

  @ApiProperty({ description: 'Exchange rate', example: 1.0 })
  @IsOptional()
  @IsNumber()
  EXCHANGE_RATE?: number;

  @ApiProperty({ description: 'Exchange rate type', example: 'Corporate' })
  @IsOptional()
  @IsString()
  EXCHANGE_RATE_TYPE?: string;

  @ApiProperty({ description: 'Exchange date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  EXCHANGE_DATE?: Date;

  @ApiProperty({ description: 'Status', example: 'OP' })
  @IsOptional()
  @IsString()
  STATUS?: string;

  @ApiProperty({ description: 'Customer trx ID', example: 1001 })
  @IsOptional()
  @IsNumber()
  CUSTOMER_TRX_ID?: number;

  @ApiProperty({ description: 'Terms sequence number', example: 1 })
  @IsOptional()
  @IsNumber()
  TERMS_SEQUENCE_NUMBER?: number;

  @ApiProperty({ description: 'Class', example: 'INV' })
  @IsOptional()
  @IsString()
  CLASS?: string;

  @ApiProperty({ description: 'Dispute date', example: '2023-01-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DISPUTE_DATE?: Date;

  @ApiProperty({ description: 'Discount date', example: '2023-01-11' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DISCOUNT_DATE?: Date;

  @ApiProperty({ description: 'Discount amount available', example: 20000 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_AMOUNT_AVAILABLE?: number;

  @ApiProperty({ description: 'Discount amount taken', example: 0 })
  @IsOptional()
  @IsNumber()
  DISCOUNT_AMOUNT_TAKEN?: number;

  @ApiProperty({ description: 'Acctd amount due remaining', example: 500000 })
  @IsOptional()
  @IsNumber()
  ACCTD_AMOUNT_DUE_REMAINING?: number;

  @ApiProperty({ description: 'Acctd amount due original', example: 1000000 })
  @IsOptional()
  @IsNumber()
  ACCTD_AMOUNT_DUE_ORIGINAL?: number;

  @ApiProperty({ description: 'Creation date', example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  CREATION_DATE?: Date;

  @ApiProperty({ description: 'Created by', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  CREATED_BY?: string;

  @ApiProperty({ description: 'Last update date', example: '2023-01-01T00:00:00Z' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  LAST_UPDATE_DATE?: Date;

  @ApiProperty({ description: 'Last updated by', example: 'SYSTEM' })
  @IsOptional()
  @IsString()
  LAST_UPDATED_BY?: string;

  @ApiProperty({ description: 'Last update login', example: 12345 })
  @IsOptional()
  @IsNumber()
  LAST_UPDATE_LOGIN?: number;
}

export class ArOutstandingsQueryDto {
  @ApiProperty({ description: 'Customer ID', required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  CUSTOMER_ID?: number;

  @ApiProperty({ description: 'Customer number', required: false })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER?: string;

  @ApiProperty({ description: 'Customer name', required: false })
  @IsOptional()
  @IsString()
  CUSTOMER_NAME?: string;

  @ApiProperty({ description: 'Invoice number', required: false })
  @IsOptional()
  @IsString()
  INVOICE_NUMBER?: string;

  @ApiProperty({ description: 'Currency code', required: false })
  @IsOptional()
  @IsString()
  CURRENCY_CODE?: string;

  @ApiProperty({ description: 'Status', required: false })
  @IsOptional()
  @IsString()
  STATUS?: string;

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
