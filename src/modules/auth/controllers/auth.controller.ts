import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import {
  LoginDto,
  RefreshTokenDto,
  AuthResponseDto,
  UserProfileDto,
  LogoutDto,
} from '../dtos/auth.dtos';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login with multi-application support',
    description:
      'Authenticate user with username/password. Optionally specify appCode to limit access to specific application.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or access denied',
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generate new access token using refresh token',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  async refresh(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<AuthResponseDto> {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logout user and blacklist tokens',
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer access token',
    required: true,
  })
  @ApiBody({ type: LogoutDto, required: false })
  @ApiResponse({
    status: 200,
    description: 'Logout successful',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async logout(
    @Headers('authorization') authorization: string,
    @Body() logoutDto?: LogoutDto,
  ): Promise<{ message: string }> {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const accessToken = authorization.substring(7);
    await this.authService.logout(accessToken, logoutDto?.refresh_token);

    return { message: 'Logout successful' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description:
      'Get authenticated user profile with application access information',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: UserProfileDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  async getProfile(@Request() req): Promise<UserProfileDto> {
    return this.authService.getProfile(req.user.userId);
  }

  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Authentication service health check',
    description: 'Check if authentication service is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Authentication service is healthy',
  })
  async health(): Promise<{
    status: string;
    timestamp: string;
    service: string;
  }> {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Authentication Service',
    };
  }

  @Public()
  @Get('applications')
  @ApiOperation({
    summary: 'Get available applications',
    description: 'List all active applications that support authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Available applications retrieved successfully',
  })
  async getApplications(): Promise<any> {
    // This could be enhanced to return actual applications from database
    return {
      applications: [
        {
          app_code: 'SOFIA',
          app_name: 'SOFIA System',
          app_description: 'SOFIA Warehouse Management System',
          app_url: 'http://localhost:3000',
        },
        {
          app_code: 'META-SERVICE',
          app_name: 'Meta Service API',
          app_description: 'SOFIA Meta Service REST API',
          app_url: 'http://localhost:9000',
        },
        {
          app_code: 'WMS',
          app_name: 'Warehouse Management',
          app_description: 'Warehouse Management System',
          app_url: 'http://localhost:8080',
        },
      ],
    };
  }
}
