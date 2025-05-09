import { Module } from '@nestjs/common';
import { SalesmanMetaMicroserviceController } from './controllers/salesman.microservice.controllers';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';
import { SalesmanMetaService } from './services/salesman.service';

@Module({
  imports: [ConfigModule],
  controllers: [SalesmanMetaMicroserviceController],
  providers: [SalesmanMetaService, OracleService, RedisService],
  exports: [SalesmanMetaService],
})
export class SalesmanMetaModule {}
