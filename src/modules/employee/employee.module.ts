import { Module } from '@nestjs/common';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';
import { EmployeeMetaService } from './services/employee.service';
import { EmployeeMetaMicroserviceController } from './controllers/employee.microservice.controllers';

@Module({
  imports: [ConfigModule],
  controllers: [EmployeeMetaMicroserviceController],
  providers: [EmployeeMetaService, OracleService, RedisService],
  exports: [EmployeeMetaService],
})
export class EmployeeMetaModule {}
