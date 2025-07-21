import configs from '../config';
import { Module } from '@nestjs/common';
import { TypeormService } from './services/typeorm.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { OracleService } from './services/oracle.service';
import { PostgreSQLService } from './services/postgresql.service';
import { RedisService } from './services/redis.service';

@Module({
  controllers: [],
  imports: [
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('auth.jwt.accessToken.secret') ||
          'your-secret-key',
        signOptions: {
          expiresIn:
            configService.get<string>('auth.jwt.accessToken.expirationTime') ||
            '1h',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [TypeormService, OracleService, PostgreSQLService, RedisService],
  exports: [
    TypeormService,
    OracleService,
    PostgreSQLService,
    RedisService,
    JwtModule,
  ],
})
export class CommonModule {}
