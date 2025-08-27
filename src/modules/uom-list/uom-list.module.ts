import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UomListService } from './uom-list.service';
import { UomListController, UomListMicroserviceController } from './controllers';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';

@Module({
  imports: [ConfigModule],
  controllers: [UomListController, UomListMicroserviceController],
  providers: [UomListService, OracleService, RedisService],
  exports: [UomListService],
})
export class UomListModule {}
