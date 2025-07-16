import { Module } from '@nestjs/common';
import { SalesItemMetaController } from './controllers/sales-item.controller';
import { SalesItemMetaService } from './services/sales-item.service';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SalesItemMetaController],
  providers: [SalesItemMetaService, OracleService, RedisService],
  exports: [SalesItemMetaService],
})
export class SalesItemMetaModule {}
