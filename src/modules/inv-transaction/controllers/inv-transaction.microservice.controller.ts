import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvTransactionService } from '../services/inv-transaction.service';
import {
    CreateTrfReceiptDto,
    CreateTrfIssueDto,
    CreateReturnBadDto,
    CreateReturnGoodDto,
    CreateCorrectionDto,
    InvTransactionResponseDto,
} from '../dtos/inv-transaction.dtos';

@Controller()
export class InvTransactionMicroserviceController {
    constructor(private readonly invTransactionService: InvTransactionService) { }

    @MessagePattern('inv_transaction.trf_receipt')
    async createTrfReceipt(
        @Payload() createDto: CreateTrfReceiptDto,
    ): Promise<InvTransactionResponseDto> {
        return this.invTransactionService.createTrfReceipt(createDto);
    }

    @MessagePattern('inv_transaction.trf_issue')
    async createTrfIssue(
        @Payload() createDto: CreateTrfIssueDto,
    ): Promise<InvTransactionResponseDto> {
        return this.invTransactionService.createTrfIssue(createDto);
    }

    @MessagePattern('inv_transaction.return_bad')
    async createReturnBad(
        @Payload() createDto: CreateReturnBadDto,
    ): Promise<InvTransactionResponseDto> {
        return this.invTransactionService.createReturnBad(createDto);
    }

    @MessagePattern('inv_transaction.return_good')
    async createReturnGood(
        @Payload() createDto: CreateReturnGoodDto,
    ): Promise<InvTransactionResponseDto> {
        return this.invTransactionService.createReturnGood(createDto);
    }

    @MessagePattern('inv_transaction.correction')
    async createCorrection(
        @Payload() createDto: CreateCorrectionDto,
    ): Promise<InvTransactionResponseDto> {
        return this.invTransactionService.createCorrection(createDto);
    }
}
