import configs from '../config';
import { Module } from '@nestjs/common';
import { TypeormService } from './services/typeorm.service';
import { ConfigModule } from '@nestjs/config';
import { OracleService } from './services/oracle.service';
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
  ],
  providers: [TypeormService, OracleService, RedisService],
  exports: [TypeormService, OracleService, RedisService],
})
export class CommonModule {}
