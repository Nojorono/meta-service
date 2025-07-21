import { Module } from '@nestjs/common';
import { WarehouseMetaController } from './controllers/warehouse.controller';
import { WarehouseMicroserviceController } from './controllers/warehouse.microservice.controller';
import { WarehouseMetaService } from './services/warehouse.service';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [WarehouseMetaController, WarehouseMicroserviceController],
  providers: [WarehouseMetaService, OracleService, RedisService],
  exports: [WarehouseMetaService],
})
export class WarehouseMetaModule {}
