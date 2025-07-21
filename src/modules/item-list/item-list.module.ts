import { Module } from '@nestjs/common';
import { ItemListMetaController } from './controllers/item-list.controller';
import { ItemListMicroserviceController } from './controllers/item-list.microservice.controller';
import { ItemListMetaService } from './services/item-list.service';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [ItemListMetaController, ItemListMicroserviceController],
  providers: [ItemListMetaService, OracleService, RedisService],
  exports: [ItemListMetaService],
})
export class ItemListMetaModule {}
