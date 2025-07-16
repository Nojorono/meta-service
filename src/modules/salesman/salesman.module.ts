import { Module } from '@nestjs/common';
import { SalesmanMetaController } from './controllers/salesman.controller';
import { SalesmanMetaService } from './services/salesman.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [SalesmanMetaController],
  providers: [SalesmanMetaService],
  exports: [SalesmanMetaService],
})
export class SalesmanMetaModule {}
