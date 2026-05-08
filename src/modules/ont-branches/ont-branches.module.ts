import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { OntBranchesController } from './controllers/ont-branches.controller';
import { OntBranchesMicroserviceController } from './controllers/ont-branches.microservice.controller';
import { OntBranchesService } from './services/ont-branches.service';

@Module({
  imports: [CommonModule],
  controllers: [OntBranchesController, OntBranchesMicroserviceController],
  providers: [OntBranchesService],
  exports: [OntBranchesService],
})
export class OntBranchesModule {}
