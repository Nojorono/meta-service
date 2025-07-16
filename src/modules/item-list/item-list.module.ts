import { Module } from '@nestjs/common';
import { ItemListMetaController } from './controllers/item-list.controller';
import { ItemListMetaService } from './services/item-list.service';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ItemListMetaController],
  providers: [ItemListMetaService, OracleService, RedisService],
  exports: [ItemListMetaService],
})
export class ItemListMetaModule {}
