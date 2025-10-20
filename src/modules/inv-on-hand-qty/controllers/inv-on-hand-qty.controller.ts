import { Controller, Get, Query, Logger } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { InvOnHandQtyService } from '../services/inv-on-hand-qty.service';
import {
    InvOnHandQtyResponseDto,
    InvOnHandQtyParamsDto,
} from '../dtos/inv-on-hand-qty.dtos';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Inventory On Hand Quantity')
@Controller('inv-on-hand-qty')
@Public()
export class InvOnHandQtyController {
    private readonly logger = new Logger(InvOnHandQtyController.name);

    constructor(private readonly invOnHandQtyService: InvOnHandQtyService) { }

    @Get()
    @ApiOperation({
        summary: 'Get inventory on hand quantity',
        description: 'Retrieve inventory on hand quantity data from Oracle database filtered by item code and subinventory code',
    })
    @ApiQuery({
        name: 'item_code',
        required: false,
        type: String,
        description: 'Item code to filter inventory data',
        example: 'CLM16',
    })
    @ApiQuery({
        name: 'subinventory_code',
        required: false,
        type: String,
        description: 'Subinventory code to filter inventory data',
        example: 'GOOD-RK-1',
    })
    @ApiResponse({
        status: 200,
        description: 'Inventory on hand quantity data retrieved successfully',
        type: InvOnHandQtyResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - missing required parameters',
    })
    @ApiResponse({
        status: 500,
        description: 'Internal server error',
    })
    async getInvOnHandQty(
        @Query('item_code') itemCode?: string,
        @Query('subinventory_code') subinventoryCode?: string,
    ): Promise<InvOnHandQtyResponseDto> {
        this.logger.log('==== REST API: Get inventory on hand quantity ====');
        this.logger.log(`Item Code: ${itemCode || 'not provided'}, Subinventory Code: ${subinventoryCode || 'not provided'}`);

        try {
            const params: InvOnHandQtyParamsDto = {
                item_code: itemCode,
                subinventory_code: subinventoryCode,
            };

            const result = await this.invOnHandQtyService.getInvOnHandQtyFromOracle(params);

            this.logger.log(
                `REST API getInvOnHandQty result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
            );

            return result;
        } catch (error) {
            this.logger.error(
                `REST API Error retrieving inventory on hand quantity: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving inventory data: ${error.message}`,
            };
        }
    }
}
