import { Module } from '@nestjs/common';
import { InvTransactionController } from './controllers/inv-transaction.controller';
import { InvTransactionMicroserviceController } from './controllers/inv-transaction.microservice.controller';
import { InvTransactionService } from './services/inv-transaction.service';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [CommonModule],
    controllers: [InvTransactionController, InvTransactionMicroserviceController],
    providers: [InvTransactionService],
    exports: [InvTransactionService],
})
export class InvTransactionModule { }
