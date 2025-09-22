import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { DoValidationController } from './controllers/do-validation.controller';
import { DoValidationService } from './services/do-validation.service';
import { DoValidationMicroserviceController } from './controllers/do-validation.microservice.controller';

@Module({
    imports: [CommonModule],
    controllers: [DoValidationController, DoValidationMicroserviceController],
    providers: [DoValidationService],
    exports: [DoValidationService],
})
export class DoValidationModule { }
