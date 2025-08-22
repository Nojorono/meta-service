import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApInvoiceService } from '../services/ap-invoice.service';
import {
    CreateApInvoiceHeaderDto,
    ApInvoiceHeaderResponseDto,
    CreateApInvoiceLineDto,
    ApInvoiceLineResponseDto,
    CreateApInvoiceWithLinesDto,
    ApInvoiceWithLinesResponseDto,
} from '../dtos/ap-invoice.dtos';

@Controller()
export class ApInvoiceMicroserviceController {
    constructor(private readonly apInvoiceService: ApInvoiceService) { }

    @MessagePattern('ap_invoice.create_header')
    async createApInvoiceHeader(
        @Payload() createDto: CreateApInvoiceHeaderDto,
    ): Promise<ApInvoiceHeaderResponseDto> {
        return this.apInvoiceService.createApInvoiceHeader(createDto);
    }

    @MessagePattern('ap_invoice.create_line')
    async createApInvoiceLine(
        @Payload() createDto: CreateApInvoiceLineDto,
    ): Promise<ApInvoiceLineResponseDto> {
        return this.apInvoiceService.createApInvoiceLine(createDto);
    }

    @MessagePattern('ap_invoice.create_with_lines')
    async createApInvoiceWithLines(
        @Payload() createDto: CreateApInvoiceWithLinesDto,
    ): Promise<ApInvoiceWithLinesResponseDto> {
        return this.apInvoiceService.createApInvoiceWithLines(createDto);
    }
}
