import { Module } from '@nestjs/common';
import { CustomerMetaService } from './services/customer.service';
import { CustomerMetaMicroserviceController } from './controllers/customer.microservice.controller';
import { CustomerMetaController } from './controllers/customer.controller';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [CustomerMetaMicroserviceController, CustomerMetaController],
  providers: [CustomerMetaService, OracleService, RedisService],
  exports: [CustomerMetaService],
})
export class CustomerMetaModule {}
