import { ApiProperty } from '@nestjs/swagger';

export class EmployeeHrisDto {
  @ApiProperty({
    description: 'Source system identifier',
    example: 'HRIS',
    required: true,
  })
  SOURCE: string;

  @ApiProperty({
    description: 'HRIS header ID',
    example: 'HRIS_001',
    required: false,
  })
  HRIS_HEADER_ID?: string;

  @ApiProperty({
    description: 'Transaction type',
    example: 'INSERT',
    required: false,
  })
  TRX_TYPE?: string;

  @ApiProperty({
    description: 'Header ID',
    example: 'HDR_001',
    required: false,
  })
  HEADER_ID?: string;

  @ApiProperty({
    description: 'Company ID',
    example: 'NNA',
    required: true,
  })
  COMPANY_ID: string;

  @ApiProperty({
    description: 'Cost center code',
    example: 'CC001',
    required: false,
  })
  COST_CENTER?: string;

  @ApiProperty({
    description: 'Employee ID',
    example: 'EMP001',
    required: true,
  })
  EMPLOYEE_ID: string;

  @ApiProperty({
    description: 'Employee full name',
    example: 'John Doe',
    required: true,
  })
  EMPLOYEE_NAME: string;

  @ApiProperty({
    description: 'Natural account code',
    example: '61',
    required: true,
  })
  NATURAL_ACCOUNT: string;

  @ApiProperty({
    description: 'Absence card number',
    example: 'AC001',
    required: true,
  })
  ABSENCE_CARD_NO: string;

  @ApiProperty({
    description: 'Employee join date',
    example: '2024-01-15',
    required: true,
  })
  JOIN_DATE: Date;

  @ApiProperty({
    description: 'Employee termination date',
    example: '2024-12-31',
    required: false,
  })
  TERMINATE_DATE?: Date;

  @ApiProperty({
    description: 'Organization ID',
    example: 'ORG001',
    required: false,
  })
  ORG_ID?: string;

  @ApiProperty({
    description: 'Organization name',
    example: 'IT Department',
    required: true,
  })
  ORG_NAME: string;

  @ApiProperty({
    description: 'Position ID',
    example: 'POS001',
    required: false,
  })
  POSITION_ID?: string;

  @ApiProperty({
    description: 'Position title',
    example: 'Software Engineer',
    required: false,
  })
  POSITION_TITLE?: string;

  @ApiProperty({
    description: 'Position level',
    example: 'SENIOR',
    required: false,
  })
  POSITION_LEVEL?: string;

  @ApiProperty({
    description: 'Position group',
    example: 'TECHNICAL',
    required: false,
  })
  POSITION_GROUP?: string;

  @ApiProperty({
    description: 'Sales flag indicator',
    example: 'Y',
    required: false,
  })
  SALES_FLAG?: string;

  @ApiProperty({
    description: 'Location code',
    example: 'LOC001',
    required: false,
  })
  LOCATION_CODE?: string;

  @ApiProperty({
    description: 'Company office',
    example: 'Main Office',
    required: false,
  })
  COMPANY_OFFICE?: string;

  @ApiProperty({
    description: 'Work location',
    example: 'Floor 3, Building A',
    required: false,
  })
  WORK_LOCATION?: string;

  @ApiProperty({
    description: 'Employee gender',
    example: 'M',
    required: false,
  })
  GENDER?: string;

  @ApiProperty({
    description: 'Employee email address',
    example: 'john.doe@company.com',
    required: false,
  })
  EMAIL?: string;

  @ApiProperty({
    description: 'Supervisor company ID',
    example: 'NNA',
    required: false,
  })
  SPV_COMPANY_ID?: string;

  @ApiProperty({
    description: 'Supervisor ID',
    example: 'SPV001',
    required: false,
  })
  SPV_ID?: string;

  @ApiProperty({
    description: 'Supervisor name',
    example: 'Jane Smith',
    required: false,
  })
  SPV_NAME?: string;

  @ApiProperty({
    description: 'Supervisor position ID',
    example: 'SPV_POS001',
    required: false,
  })
  SPV_POSITION_ID?: string;

  @ApiProperty({
    description: 'Supervisor position name',
    example: 'Team Lead',
    required: false,
  })
  SPV_POSITION_NAME?: string;

  @ApiProperty({
    description: 'Bank code',
    example: 'BCA',
    required: false,
  })
  BANK_CODE?: string;

  @ApiProperty({
    description: 'Bank branch name',
    example: 'Jakarta Central',
    required: false,
  })
  BRANCH_NAME?: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '1234567890',
    required: false,
  })
  ACCOUNT_NO?: string;

  @ApiProperty({
    description: 'Bank account name',
    example: 'John Doe',
    required: false,
  })
  ACCOUNT_NAME?: string;

  @ApiProperty({
    description: 'Import status',
    example: 'PENDING',
    required: false,
  })
  IMPORT_STATUS?: string;

  @ApiProperty({
    description: 'Processing message',
    example: 'Successfully processed',
    required: false,
  })
  MESSAGE?: string;

  @ApiProperty({
    description: 'Meta person ID',
    example: 'META_PERSON_001',
    required: false,
  })
  META_PERSON_ID?: string;

  @ApiProperty({
    description: 'Meta vendor ID',
    example: 'META_VENDOR_001',
    required: false,
  })
  META_VENDOR_ID?: string;

  @ApiProperty({
    description: 'Meta sales ID',
    example: 'META_SALES_001',
    required: false,
  })
  META_SALES_ID?: string;

  @ApiProperty({
    description: 'Meta locator ID',
    example: 'META_LOCATOR_001',
    required: false,
  })
  META_LOCATOR_ID?: string;

  @ApiProperty({
    description: 'Custom attribute 1',
    example: 'Custom Value 1',
    required: false,
  })
  ATTRIBUTE1?: string;

  @ApiProperty({
    description: 'Custom attribute 2',
    example: 'Custom Value 2',
    required: false,
  })
  ATTRIBUTE2?: string;

  @ApiProperty({
    description: 'Custom attribute 3',
    example: 'Custom Value 3',
    required: false,
  })
  ATTRIBUTE3?: string;

  @ApiProperty({
    description: 'Custom attribute 4',
    example: 'Custom Value 4',
    required: false,
  })
  ATTRIBUTE4?: string;

  @ApiProperty({
    description: 'Custom attribute 5',
    example: 'Custom Value 5',
    required: false,
  })
  ATTRIBUTE5?: string;

  @ApiProperty({
    description: 'Custom attribute 6',
    example: 'Custom Value 6',
    required: false,
  })
  ATTRIBUTE6?: string;

  @ApiProperty({
    description: 'Custom attribute 7',
    example: 'Custom Value 7',
    required: false,
  })
  ATTRIBUTE7?: string;

  @ApiProperty({
    description: 'Custom attribute 8',
    example: 'Custom Value 8',
    required: false,
  })
  ATTRIBUTE8?: string;

  @ApiProperty({
    description: 'Custom attribute 9',
    example: 'Custom Value 9',
    required: false,
  })
  ATTRIBUTE9?: string;

  @ApiProperty({
    description: 'Custom attribute 10',
    example: 'Custom Value 10',
    required: false,
  })
  ATTRIBUTE10?: string;

  @ApiProperty({
    description: 'Custom attribute 11',
    example: 'Custom Value 11',
    required: false,
  })
  ATTRIBUTE11?: string;

  @ApiProperty({
    description: 'Custom attribute 12',
    example: 'Custom Value 12',
    required: false,
  })
  ATTRIBUTE12?: string;

  @ApiProperty({
    description: 'Custom attribute 13',
    example: 'Custom Value 13',
    required: false,
  })
  ATTRIBUTE13?: string;

  @ApiProperty({
    description: 'Custom attribute 14',
    example: 'Custom Value 14',
    required: false,
  })
  ATTRIBUTE14?: string;

  @ApiProperty({
    description: 'Custom attribute 15',
    example: 'Custom Value 15',
    required: false,
  })
  ATTRIBUTE15?: string;

  @ApiProperty({
    description: 'Source system name',
    example: 'HRIS_SYSTEM',
    required: false,
  })
  SOURCE_SYSTEM?: string;

  @ApiProperty({
    description: 'Source batch ID',
    example: 'BATCH_001',
    required: false,
  })
  SOURCE_BATCH_ID?: string;

  @ApiProperty({
    description: 'Source header ID',
    example: 'SRC_HDR_001',
    required: false,
  })
  SOURCE_HEADER_ID?: string;

  @ApiProperty({
    description: 'Source line ID',
    example: 'SRC_LINE_001',
    required: false,
  })
  SOURCE_LINE_ID?: string;

  @ApiProperty({
    description: 'Record creation date',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  CREATION_DATE?: Date;

  @ApiProperty({
    description: 'User who created the record',
    example: 'SYSTEM',
    required: false,
  })
  CREATED_BY?: string;

  @ApiProperty({
    description: 'Last update login',
    example: 'USER123',
    required: false,
  })
  LAST_UPDATE_LOGIN?: string;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-15T15:45:00Z',
    required: false,
  })
  LAST_UPDATE_DATE?: Date;

  @ApiProperty({
    description: 'User who last updated the record',
    example: 'ADMIN',
    required: false,
  })
  LAST_UPDATED_BY?: string;
}
