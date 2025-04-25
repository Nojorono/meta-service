import configs from '../config';
import { Module } from '@nestjs/common';
import { TypeormService } from './services/typeorm.service';
import { ConfigModule } from '@nestjs/config';
import { OracleService } from './services/oracle.service';

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
  providers: [TypeormService, OracleService],
  exports: [TypeormService, OracleService],
})
export class CommonModule {}
