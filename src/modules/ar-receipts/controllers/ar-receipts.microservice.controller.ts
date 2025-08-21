import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ArReceiptsService } from '../services/ar-receipts.service';
import { CreateArReceiptDto, ArReceiptResponseDto } from '../dtos/ar-receipts.dtos';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
@Internal()
export class ArReceiptsMicroserviceController {
    constructor(private readonly arReceiptsService: ArReceiptsService) { }

    @MessagePattern('ar-receipts.create')
    async createArReceipt(@Payload() createDto: CreateArReceiptDto): Promise<ArReceiptResponseDto> {
        return this.arReceiptsService.createArReceipt(createDto);
    }
}
