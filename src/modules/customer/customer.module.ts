import { Module } from '@nestjs/common';
import { CustomerMetaService } from './services/customer.service';
import { CustomerMetaMicroserviceController } from './controllers/customer.microservice.controller';
import { OracleService } from '../../common/services/oracle.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [CustomerMetaMicroserviceController],
  providers: [CustomerMetaService, OracleService],
  exports: [CustomerMetaService],
})
export class CustomerMetaModule {}
