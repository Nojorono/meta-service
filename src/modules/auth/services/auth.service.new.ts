import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OracleService } from '../../../common/services/oracle.service';
import { RedisService } from '../../../common/services/redis.service';
import { LoginDto, AuthResponseDto, UserProfileDto } from '../dtos/auth.dtos';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly oracleService: OracleService,
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
      // First, get user basic info
      const userQuery = `
        SELECT u.user_id, u.username, u.email, u.password_hash, u.full_name, u.status,
               u.created_date, u.last_login_date
        FROM auth_users u
        WHERE u.username = ? AND u.status = 'ACTIVE'
      `;

      const userResult = await this.oracleService.executeQuery(userQuery, [
        username,
      ]);

      if (!userResult.rows || userResult.rows.length === 0) {
        return null;
      }

      const user = userResult.rows[0];
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordValid) {
        return null;
      }

      // Get all applications for this user
      let appsQuery = `
        SELECT a.app_code, a.app_name, ua.role, ua.permissions, a.app_description
        FROM auth_user_applications ua
        JOIN auth_applications a ON ua.app_id = a.app_id
        WHERE ua.user_id = ? AND ua.status = 'ACTIVE' AND a.status = 'ACTIVE'
      `;
      const appsParams = [user.user_id];

      // If specific app requested, check access
      if (appCode) {
        appsQuery += ` AND a.app_code = ?`;
        appsParams.push(appCode);
      }

      const appsResult = await this.oracleService.executeQuery(
        appsQuery,
        appsParams,
      );

      // If specific app requested but user has no access, deny
      if (appCode && (!appsResult.rows || appsResult.rows.length === 0)) {
        return null;
      }

      // Update last login
      const updateQuery = `
        UPDATE auth_users 
        SET last_login_date = SYSDATE 
        WHERE user_id = ?
      `;
      await this.oracleService.executeQuery(updateQuery, [user.user_id]);

      // Return user without password but with applications
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, ...userResult } = user;
      return {
        ...userResult,
        applications: appsResult.rows || [],
      };
    } catch (error) {
      this.logger.error('Error validating user:', error);
      throw new Error('Authentication failed');
    }
  }

  async validateUserById(userId: number): Promise<any> {
    try {
      const userQuery = `
        SELECT u.user_id, u.username, u.email, u.full_name, u.status,
               u.created_date, u.last_login_date
        FROM auth_users u 
        WHERE u.user_id = ? AND u.status = 'ACTIVE'
      `;

      const userResult = await this.oracleService.executeQuery(userQuery, [
        userId,
      ]);

      if (!userResult.rows || userResult.rows.length === 0) {
        return null;
      }

      const user = userResult.rows[0];

      // Get user applications
      const appsQuery = `
        SELECT a.app_code, a.app_name, ua.role, ua.permissions, a.app_description
        FROM auth_user_applications ua
        JOIN auth_applications a ON ua.app_id = a.app_id
        WHERE ua.user_id = ? AND ua.status = 'ACTIVE' AND a.status = 'ACTIVE'
      `;

      const appsResult = await this.oracleService.executeQuery(appsQuery, [
        userId,
      ]);

      return {
        ...user,
        applications: appsResult.rows || [],
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
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
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
          await this.redisService.setex(`blacklist_${token}`, ttl, 'true');
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
    const expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
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
      const query = `
        SELECT ua.role, ua.permissions, ua.status, a.app_name
        FROM auth_user_applications ua
        JOIN auth_applications a ON ua.app_id = a.app_id
        WHERE ua.user_id = ? AND a.app_code = ? 
        AND ua.status = 'ACTIVE' AND a.status = 'ACTIVE'
      `;

      const result = await this.oracleService.executeQuery(query, [
        userId,
        appCode,
      ]);

      if (result.rows && result.rows.length > 0) {
        return result.rows[0];
      }

      return null;
    } catch (error) {
      this.logger.error('Error checking application access:', error);
      return null;
    }
  }
}
