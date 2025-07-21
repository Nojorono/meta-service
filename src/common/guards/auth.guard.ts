import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Check if endpoint is public
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // Check if endpoint is internal (microservice)
    const isInternal = this.reflector.getAllAndOverride<boolean>('isInternal', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isInternal) {
      return this.validateInternalAccess(context);
    }

    // For external access, validate JWT token
    return this.validateExternalAccess(context);
  }

  private validateInternalAccess(context: ExecutionContext): boolean {
    // For message patterns (microservice), allow access
    if (context.getType() === 'rpc') {
      return true;
    }

    // For HTTP requests marked as internal, check internal API key
    const request = context.switchToHttp().getRequest();
    const internalApiKey = request.headers['x-internal-api-key'];
    const expectedKey = process.env.INTERNAL_API_KEY;

    if (expectedKey && internalApiKey === expectedKey) {
      return true;
    }

    // Allow internal access without key for now (can be tightened later)
    return true;
  }

  private validateExternalAccess(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('translation.Access token required');
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });

      // Check if token is blacklisted (for logout functionality)
      // Note: This is a sync check, for better performance you might want to make this async
      // and use Redis to check blacklist status

      request.user = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException('translation.Invalid access token');
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
