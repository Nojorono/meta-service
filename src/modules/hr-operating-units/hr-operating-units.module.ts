import { Module } from '@nestjs/common';
import { HrOperatingUnitsController } from './controllers/hr-operating-units.controller';
import { HrOperatingUnitsMicroserviceController } from './controllers/hr-operating-units.microservice.controller';
import { HrOperatingUnitsService } from './services/hr-operating-units.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [
    HrOperatingUnitsController,
    HrOperatingUnitsMicroserviceController,
  ],
  providers: [HrOperatingUnitsService],
  exports: [HrOperatingUnitsService],
})
export class HrOperatingUnitsModule {}

