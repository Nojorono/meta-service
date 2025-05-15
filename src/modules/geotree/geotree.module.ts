import { Module } from '@nestjs/common';
import { GeoTreeMetaMicroserviceController } from './controllers/geotree.microservice.controllers';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';
import { GeoTreeMetaService } from './services/geotree.service';

@Module({
  imports: [ConfigModule],
  controllers: [GeoTreeMetaMicroserviceController],
  providers: [GeoTreeMetaService, OracleService, RedisService],
  exports: [GeoTreeMetaService],
})
export class GeoTreeMetaModule {}
