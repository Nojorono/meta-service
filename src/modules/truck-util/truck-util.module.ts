import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TruckUtilService } from './truck-util.service';
import { TruckUtilController, TruckUtilMicroserviceController } from './controllers';
import { OracleService } from '../../common/services/oracle.service';
import { RedisService } from '../../common/services/redis.service';

@Module({
  imports: [ConfigModule],
  controllers: [TruckUtilController, TruckUtilMicroserviceController],
  providers: [TruckUtilService, OracleService, RedisService],
  exports: [TruckUtilService],
})
export class TruckUtilModule {}
