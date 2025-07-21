import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RedisService } from '../../../common/services/redis.service';
import { LoginDto, AuthResponseDto, UserProfileDto } from '../dtos/auth.dtos';
import {
  AuthUser,
  AuthApplication,
  AuthUserApplication,
  UserStatus,
  ApplicationStatus,
  UserApplicationStatus,
} from '../entities';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(AuthUser)
    private readonly userRepository: Repository<AuthUser>,
    @InjectRepository(AuthApplication)
    private readonly applicationRepository: Repository<AuthApplication>,
    @InjectRepository(AuthUserApplication)
    private readonly userApplicationRepository: Repository<AuthUserApplication>,
    private readonly redisService: RedisService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    try {
      const { username, password, appCode } = loginDto;

      // Validate user credentials
      const user = await this.validateUser(username, password, appCode);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials or access denied');
      }

      // Generate JWT tokens
      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        token_type: 'Bearer',
        expires_in: this.getTokenExpirationSeconds(),
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          name: user.full_name,
          applications: user.applications || [],
        },
      };
    } catch (error) {
      this.logger.error('Login failed:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponseDto> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      });

      // Get user from database
      const user = await this.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Check if refresh token is blacklisted
      const isBlacklisted = await this.isTokenBlacklisted(refreshToken);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }

      // Blacklist old refresh token
      await this.blacklistToken(refreshToken);

      // Generate new tokens
      const tokens = await this.generateTokens(user);

      return {
        ...tokens,
        token_type: 'Bearer',
        expires_in: this.getTokenExpirationSeconds(),
        user: {
          id: user.user_id,
          username: user.username,
          email: user.email,
          name: user.full_name,
          applications: user.applications || [],
        },
      };
    } catch (error) {
      this.logger.error('Token refresh failed:', error);
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      // Blacklist access token
      await this.blacklistToken(accessToken);

      // Blacklist refresh token if provided
      if (refreshToken) {
        await this.blacklistToken(refreshToken);
      }

      this.logger.log('User logged out successfully');
    } catch (error) {
      this.logger.error('Logout failed:', error);
      throw error;
    }
  }

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.validateUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.user_id,
      username: user.username,
      email: user.email,
      name: user.full_name,
      applications: user.applications || [],
      created_at: user.created_date,
      last_login: user.last_login_date,
    };
  }

  async validateUser(
    username: string,
    password: string,
    appCode?: string,
  ): Promise<any> {
    try {
      // First, get user basic info with applications
      const user = await this.userRepository.findOne({
        where: {
          username,
          status: UserStatus.ACTIVE,
        },
        relations: ['userApplications', 'userApplications.application'],
      });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        return null;
      }

      // Filter active applications
      const activeApplications = user.userApplications.filter(
        (ua) =>
          ua.status === UserApplicationStatus.ACTIVE &&
          ua.application.status === ApplicationStatus.ACTIVE,
      );

      // If specific app requested, check access
      if (appCode) {
        const hasAccess = activeApplications.some(
          (ua) => ua.application.app_code === appCode,
        );
        if (!hasAccess) {
          return null;
        }
      }

      // Update last login
      await this.userRepository.update(user.user_id, {
        last_login_date: new Date(),
      });

      // Return user without password but with applications
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, userApplications, ...userResult } = user;
      return {
        ...userResult,
        applications: activeApplications.map((ua) => ({
          app_code: ua.application.app_code,
          app_name: ua.application.app_name,
          app_description: ua.application.app_description,
          role: ua.role,
          permissions: ua.permissions,
        })),
      };
    } catch (error) {
      this.logger.error('Error validating user:', error);
      throw new Error('Authentication failed');
    }
  }

  async validateUserById(userId: number): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          user_id: userId,
          status: UserStatus.ACTIVE,
        },
        relations: ['userApplications', 'userApplications.application'],
      });

      if (!user) {
        return null;
      }

      // Filter active applications
      const activeApplications = user.userApplications.filter(
        (ua) =>
          ua.status === UserApplicationStatus.ACTIVE &&
          ua.application.status === ApplicationStatus.ACTIVE,
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, userApplications, ...userResult } = user;

      return {
        ...userResult,
        applications: activeApplications.map((ua) => ({
          app_code: ua.application.app_code,
          app_name: ua.application.app_name,
          app_description: ua.application.app_description,
          role: ua.role,
          permissions: ua.permissions,
        })),
      };
    } catch (error) {
      this.logger.error('User validation by ID failed:', error);
      return null;
    }
  }

  private async generateTokens(
    user: any,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = {
      username: user.username,
      sub: user.user_id,
      email: user.email,
      applications: user.applications,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRED || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRED || '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async blacklistToken(token: string): Promise<void> {
    try {
      // Decode token to get expiration time
      const decoded = this.jwtService.decode(token) as any;
      const expirationTime = decoded?.exp;

      if (expirationTime) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = expirationTime - now;

        if (ttl > 0) {
          // Store token in Redis with TTL
          await this.redisService.set(`blacklist_${token}`, 'true', ttl);
        }
      }
    } catch (error) {
      this.logger.error('Failed to blacklist token:', error);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const result = await this.redisService.get(`blacklist_${token}`);
      return result === 'true';
    } catch (error) {
      this.logger.error('Failed to check token blacklist:', error);
      return false;
    }
  }

  private getTokenExpirationSeconds(): number {
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRED || '15m';
    const match = expiresIn.match(/(\d+)([smhd])/);

    if (match) {
      const value = parseInt(match[1]);
      const unit = match[2];

      switch (unit) {
        case 's':
          return value;
        case 'm':
          return value * 60;
        case 'h':
          return value * 60 * 60;
        case 'd':
          return value * 24 * 60 * 60;
        default:
          return 900; // 15 minutes default
      }
    }

    return 900; // 15 minutes default
  }

  async checkApplicationAccess(userId: number, appCode: string): Promise<any> {
    try {
      const userApplication = await this.userApplicationRepository.findOne({
        where: {
          user_id: userId,
          status: UserApplicationStatus.ACTIVE,
          application: {
            app_code: appCode,
            status: ApplicationStatus.ACTIVE,
          },
        },
        relations: ['application'],
      });

      if (userApplication) {
        return {
          role: userApplication.role,
          permissions: userApplication.permissions,
          status: userApplication.status,
          app_name: userApplication.application.app_name,
        };
      }

      return null;
    } catch (error) {
      this.logger.error('Error checking application access:', error);
      return null;
    }
  }
}
