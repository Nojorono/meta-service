import { Module } from '@nestjs/common';
import { SalesmanMetaController } from './controllers/salesman.controller';
import { SalesmanMicroserviceController } from './controllers/salesman.microservice.controller';
import { SalesmanMetaService } from './services/salesman.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [SalesmanMetaController, SalesmanMicroserviceController],
  providers: [SalesmanMetaService],
  exports: [SalesmanMetaService],
})
export class SalesmanMetaModule {}
