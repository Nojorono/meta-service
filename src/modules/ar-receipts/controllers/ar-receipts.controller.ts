import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ArReceiptsService } from '../services/ar-receipts.service';
import { CreateArReceiptDto, ArReceiptResponseDto } from '../dtos/ar-receipts.dtos';
import { GenericResponseDto } from 'src/dtos/generic.response.dto';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('AR Receipts')
@Controller('ar-receipts')
@Public()
export class ArReceiptsController {
    constructor(private readonly arReceiptsService: ArReceiptsService) { }

    @Post()
    @ApiOperation({ summary: 'Create AR Receipt' })
    @ApiResponse({
        status: 201,
        description: 'AR Receipt created successfully',
        type: GenericResponseDto,
    })
    async createArReceipt(@Body() createDto: CreateArReceiptDto): Promise<ArReceiptResponseDto> {
        const result = await this.arReceiptsService.createArReceipt(createDto);
        return result;
    }
}
