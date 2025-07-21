import { IsOptional, IsString, IsNumber, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ArOutstandingsDto {
  @ApiProperty({ description: 'Call plan number', example: 'CP12345' })
  @IsOptional()
  @IsString()
  CALL_PLAN_NUMBER?: string;

  @ApiProperty({ description: 'SFA document number', example: 'SFA12345' })
  @IsOptional()
  @IsString()
  SFA_DOCUMENT_NUMBER?: string;

  @ApiProperty({ description: 'TRX Date', example: '2023-10-01' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  TRX_DATE: Date;

  @ApiProperty({ description: 'Invoice Currency Code', example: 'IDR' })
  @IsOptional()
  @IsString()
  INVOICE_CURRENCY_CODE: string;

  @ApiProperty({ description: 'Customer Number', example: 'BD2WSWACX031' })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER: string;

  @ApiProperty({ description: 'Customer Name', example: 'PT. ABCD Indonesia' })
  @IsOptional()
  @IsString()
  CUSTOMER_NAME: string;

  @ApiProperty({ description: 'Sales Rep Number', example: 'SR12345' })
  @IsOptional()
  @IsString()
  SALESREP_NUMBER?: string;

  @ApiProperty({ description: 'Ship To', example: 'SUBUR CARINGIN' })
  @IsOptional()
  @IsString()
  SHIP_TO?: string;

  @ApiProperty({ description: 'Bill To', example: 'SUBUR CARINGIN' })
  @IsOptional()
  @IsString()
  BILL_TO?: string;

  @ApiProperty({ description: 'Amount', example: '1786000' })
  @IsOptional()
  @IsNumber()
  AMOUNT: number;

  @ApiProperty({ description: 'Due Remaining', example: '1086000' })
  @IsOptional()
  @IsNumber()
  DUE_REMAINING: number;

  @ApiProperty({ description: 'Due Date', example: '2025-03-15' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  DUE_DATE: Date;

  @ApiProperty({ description: 'Oracle Invoice Number', example: '4832951' })
  @IsOptional()
  @IsString()
  ORACLE_INVOICE_NUMBER: string;

  @ApiProperty({ description: 'Customer Account ID', example: 12345 })
  @IsOptional()
  @IsNumber()
  CUST_ACCOUNT_ID?: number;

  @ApiProperty({ description: 'Ship To Site Use ID', example: 67890 })
  @IsOptional()
  @IsNumber()
  SHIP_TO_SITE_USE_ID?: number;

  @ApiProperty({ description: 'Bill To Site Use ID', example: 54321 })
  @IsOptional()
  @IsNumber()
  BILL_TO_SITE_USE_ID?: number;

  @ApiProperty({ description: 'Customer Transaction ID', example: 98765 })
  @IsOptional()
  @IsNumber()
  CUSTOMER_TRX_ID?: number;

  @ApiProperty({ description: 'Last Update Date', example: '2024-01-15' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  LAST_UPDATE_DATE: Date;

  @ApiProperty({ description: 'Organization Code', example: 'ORG001' })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

  @ApiProperty({
    description: 'Organization Name',
    example: 'Main Organization',
  })
  @IsOptional()
  @IsString()
  ORGANIZATION_NAME?: string;

  @ApiProperty({ description: 'Organization ID', example: 123 })
  @IsOptional()
  @IsNumber()
  ORGANIZATION_ID?: number;

  @ApiProperty({ description: 'Organization Name', example: 'Main Org' })
  @IsOptional()
  @IsString()
  ORG_NAME?: string;

  @ApiProperty({ description: 'Organization ID', example: 456 })
  @IsOptional()
  @IsNumber()
  ORG_ID?: number;
}

export class ArOutstandingsQueryDto {
  @ApiProperty({ description: 'Call plan number', example: 'CP12345' })
  @IsOptional()
  @IsString()
  CALL_PLAN_NUMBER?: string;

  @ApiProperty({ description: 'SFA document number', example: 'SFA12345' })
  @IsOptional()
  @IsString()
  SFA_DOCUMENT_NUMBER?: string;

  @ApiProperty({ description: 'Customer Number', example: 'BD2WSWACX031' })
  @IsOptional()
  @IsString()
  CUSTOMER_NUMBER?: string;

  @ApiProperty({ description: 'Customer Name', example: 'PT. ABCD Indonesia' })
  @IsOptional()
  @IsString()
  CUSTOMER_NAME?: string;

  @ApiProperty({ description: 'Sales Rep Number', example: 'SR12345' })
  @IsOptional()
  @IsString()
  SALESREP_NUMBER?: string;

  @ApiProperty({ description: 'Oracle Invoice Number', example: '4832951' })
  @IsOptional()
  @IsString()
  ORACLE_INVOICE_NUMBER?: string;

  @ApiProperty({ description: 'Customer Account ID', example: 12345 })
  @IsOptional()
  @IsNumber()
  CUST_ACCOUNT_ID?: number;

  @ApiProperty({ description: 'Customer Transaction ID', example: 98765 })
  @IsOptional()
  @IsNumber()
  CUSTOMER_TRX_ID?: number;

  @ApiProperty({ description: 'Organization Code', example: 'ORG001' })
  @IsOptional()
  @IsString()
  ORGANIZATION_CODE?: string;

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
