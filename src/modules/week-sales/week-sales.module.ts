import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { WeekSalesController } from './controllers/week-sales.controller';
import { WeekSalesMicroserviceController } from './controllers/week-sales.microservice.controller';
import { WeekSalesService } from './services/week-sales.service';

@Module({
    imports: [CommonModule],
    controllers: [WeekSalesController, WeekSalesMicroserviceController],
    providers: [WeekSalesService],
    exports: [WeekSalesService],
})
export class WeekSalesModule { }
