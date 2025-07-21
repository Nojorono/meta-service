import { Module } from '@nestjs/common';
import { OrganizationController } from './controllers/organization.controller';
import { OrganizationMicroserviceController } from './controllers/organization.microservice.controller';
import { OrganizationService } from './services/organization.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [OrganizationController, OrganizationMicroserviceController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationMetaModule {}
