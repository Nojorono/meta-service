import { Module } from '@nestjs/common';
import { BranchMetaService } from './services/branch.service';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';
import { ConfigModule } from '@nestjs/config';
import { BranchMetaMicroserviceController } from './controllers/branch.microservice.controllers';
import { BranchMetaController } from './controllers/branch.controller';

@Module({
  imports: [ConfigModule],
  controllers: [BranchMetaMicroserviceController, BranchMetaController],
  providers: [BranchMetaService, OracleService, RedisService],
  exports: [BranchMetaService],
})
export class BranchMetaModule {}
