import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email for authentication',
    example: 'admin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Application code to access (optional)',
    example: 'META-SERVICE',
  })
  @IsString()
  @IsOptional()
  appCode?: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}

export class UserApplicationDto {
  @ApiProperty({ description: 'Application code', example: 'META-SERVICE' })
  app_code: string;

  @ApiProperty({ description: 'Application name', example: 'Meta Service API' })
  app_name: string;

  @ApiPropertyOptional({ description: 'Application description' })
  app_description?: string;

  @ApiProperty({
    description: 'User role in this application',
    example: 'admin',
  })
  role: string;

  @ApiPropertyOptional({ description: 'User permissions in JSON format' })
  permissions?: string;
}

export class UserDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Username', example: 'admin' })
  username: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'admin@company.com',
  })
  email?: string;

  @ApiProperty({ description: 'Full name', example: 'System Administrator' })
  name: string;

  @ApiProperty({
    description: 'User applications access',
    type: [UserApplicationDto],
  })
  applications: UserApplicationDto[];
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refresh_token: string;

  @ApiProperty({ description: 'Token type', example: 'Bearer' })
  token_type: string;

  @ApiProperty({ description: 'Token expiration in seconds', example: 900 })
  expires_in: number;

  @ApiProperty({ description: 'Authenticated user information', type: UserDto })
  user: UserDto;
}

export class UserProfileDto {
  @ApiProperty({ description: 'User ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Username', example: 'admin' })
  username: string;

  @ApiPropertyOptional({
    description: 'User email',
    example: 'admin@company.com',
  })
  email?: string;

  @ApiProperty({ description: 'Full name', example: 'System Administrator' })
  name: string;

  @ApiProperty({
    description: 'User applications access',
    type: [UserApplicationDto],
  })
  applications: UserApplicationDto[];

  @ApiPropertyOptional({ description: 'Account creation date' })
  created_at?: Date;

  @ApiPropertyOptional({ description: 'Last login date' })
  last_login?: Date;
}

export class LogoutDto {
  @ApiPropertyOptional({
    description: 'JWT refresh token to blacklist (optional)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString()
  @IsOptional()
  refresh_token?: string;
}
