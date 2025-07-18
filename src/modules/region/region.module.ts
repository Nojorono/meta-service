import { Module } from '@nestjs/common';
import { RegionMetaMicroserviceController } from './controllers/region.microservice.controllers';
import { RegionMetaController } from './controllers/region.controller';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';
import { RegionMetaService } from './services/region.service';

@Module({
  imports: [ConfigModule],
  controllers: [RegionMetaMicroserviceController, RegionMetaController],
  providers: [RegionMetaService, OracleService, RedisService],
  exports: [RegionMetaService],
})
export class RegionMetaModule {}
