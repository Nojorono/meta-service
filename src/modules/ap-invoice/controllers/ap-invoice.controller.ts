import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApInvoiceService } from '../services/ap-invoice.service';
import {
    CreateApInvoiceHeaderDto,
    ApInvoiceHeaderResponseDto,
    CreateApInvoiceLineDto,
    ApInvoiceLineResponseDto,
    CreateApInvoiceWithLinesDto,
    ApInvoiceWithLinesResponseDto,
} from '../dtos/ap-invoice.dtos';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('AP Invoice')
@Controller('ap-invoice')
@Public()
export class ApInvoiceController {
    constructor(private readonly apInvoiceService: ApInvoiceService) { }

    @Post('header')
    @ApiOperation({
        summary: 'Create AP Invoice Header',
        description: 'Creates an AP invoice header in XTD_AP_INVOICES_IFACE_V table. Use the returned HEADER_IFACE_ID to create associated lines.'
    })
    @ApiResponse({
        status: 201,
        description: 'AP Invoice header created successfully',
        type: ApInvoiceHeaderResponseDto,
    })
    async createApInvoiceHeader(
        @Body() createDto: CreateApInvoiceHeaderDto,
    ): Promise<ApInvoiceHeaderResponseDto> {
        return await this.apInvoiceService.createApInvoiceHeader(createDto);
    }

    @Post('line')
    @ApiOperation({
        summary: 'Create AP Invoice Line',
        description: 'Creates an AP invoice line in XTD_AP_INVOICE_LINES_IFACE_V table. Requires HEADER_IFACE_ID from previously created header.'
    })
    @ApiResponse({
        status: 201,
        description: 'AP Invoice line created successfully',
        type: ApInvoiceLineResponseDto,
    })
    async createApInvoiceLine(
        @Body() createDto: CreateApInvoiceLineDto,
    ): Promise<ApInvoiceLineResponseDto> {
        return await this.apInvoiceService.createApInvoiceLine(createDto);
    }

    @Post('with-lines')
    @ApiOperation({
        summary: 'Create AP Invoice with Lines',
        description: 'Creates an AP invoice header with associated lines in one operation. This creates both header and lines automatically.'
    })
    @ApiResponse({
        status: 201,
        description: 'AP Invoice with lines created successfully',
        type: ApInvoiceWithLinesResponseDto,
    })
    async createApInvoiceWithLines(
        @Body() createDto: CreateApInvoiceWithLinesDto,
    ): Promise<ApInvoiceWithLinesResponseDto> {
        return await this.apInvoiceService.createApInvoiceWithLines(createDto);
    }
}
