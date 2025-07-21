import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CommonModule } from '../../common/common.module';
import { PostgreSQLService } from '../../common/services/postgresql.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        signOptions: {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRED,
        },
      }),
    }),
    CommonModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PostgreSQLService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
