import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InvTransactionService } from '../services/inv-transaction.service';
import {
    CreateTrfReceiptDto,
    CreateTrfIssueDto,
    CreateReturnBadDto,
    CreateReturnGoodDto,
    CreateCorrectionDto,
    InvTransactionResponseDto,
} from '../dtos/inv-transaction.dtos';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Inventory Transaction')
@Controller('inv-transaction')
@Public()
export class InvTransactionController {
    constructor(private readonly invTransactionService: InvTransactionService) { }

    @Post('trf-receipt')
    @ApiOperation({
        summary: 'Create Transfer Receipt Transaction',
        description: 'Creates a transfer receipt transaction in XTD_INV_MATERIAL_TRX_IFACE_V table with positive quantity.'
    })
    @ApiResponse({
        status: 201,
        description: 'Transfer receipt transaction created successfully',
        type: InvTransactionResponseDto,
    })
    async createTrfReceipt(
        @Body() createDto: CreateTrfReceiptDto,
    ): Promise<InvTransactionResponseDto> {
        return await this.invTransactionService.createTrfReceipt(createDto);
    }

    @Post('trf-issue')
    @ApiOperation({
        summary: 'Create Transfer Issue Transaction',
        description: 'Creates a transfer issue transaction in XTD_INV_MATERIAL_TRX_IFACE_V table with negative quantity.'
    })
    @ApiResponse({
        status: 201,
        description: 'Transfer issue transaction created successfully',
        type: InvTransactionResponseDto,
    })
    async createTrfIssue(
        @Body() createDto: CreateTrfIssueDto,
    ): Promise<InvTransactionResponseDto> {
        return await this.invTransactionService.createTrfIssue(createDto);
    }

    @Post('return-bad')
    @ApiOperation({
        summary: 'Create Return Bad Transaction',
        description: 'Creates a return bad transaction in XTD_INV_MATERIAL_TRX_IFACE_V table with transfer to BAD-ROKOK subinventory.'
    })
    @ApiResponse({
        status: 201,
        description: 'Return bad transaction created successfully',
        type: InvTransactionResponseDto,
    })
    async createReturnBad(
        @Body() createDto: CreateReturnBadDto,
    ): Promise<InvTransactionResponseDto> {
        return await this.invTransactionService.createReturnBad(createDto);
    }

    @Post('return-good')
    @ApiOperation({
        summary: 'Create Return Good Transaction',
        description: 'Creates a return good transaction in XTD_INV_MATERIAL_TRX_IFACE_V table with transfer to KECIL subinventory.'
    })
    @ApiResponse({
        status: 201,
        description: 'Return good transaction created successfully',
        type: InvTransactionResponseDto,
    })
    async createReturnGood(
        @Body() createDto: CreateReturnGoodDto,
    ): Promise<InvTransactionResponseDto> {
        return await this.invTransactionService.createReturnGood(createDto);
    }

    @Post('correction')
    @ApiOperation({
        summary: 'Create Correction Transaction',
        description: 'Creates a correction transaction in XTD_INV_MATERIAL_TRX_IFACE_V table with negative quantity and transfer to KECIL subinventory.'
    })
    @ApiResponse({
        status: 201,
        description: 'Correction transaction created successfully',
        type: InvTransactionResponseDto,
    })
    async createCorrection(
        @Body() createDto: CreateCorrectionDto,
    ): Promise<InvTransactionResponseDto> {
        return await this.invTransactionService.createCorrection(createDto);
    }
}
