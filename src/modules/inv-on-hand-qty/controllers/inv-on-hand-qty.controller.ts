import { Controller, Get, Query, Delete, Logger, HttpCode, HttpStatus } from '@nestjs/common';
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

    @Delete('cache')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Clear inventory on hand quantity cache',
        description: 'Invalidate cache for inventory on hand quantity. Can clear specific cache by item_code and subinventory_code, or all caches if no parameters provided.',
    })
    @ApiQuery({
        name: 'item_code',
        required: false,
        type: String,
        description: 'Item code to clear specific cache',
        example: 'CLM16',
    })
    @ApiQuery({
        name: 'subinventory_code',
        required: false,
        type: String,
        description: 'Subinventory code to clear specific cache',
        example: 'GOOD-RK-1',
    })
    @ApiResponse({
        status: 200,
        description: 'Cache cleared successfully',
    })
    async clearCache(
        @Query('item_code') itemCode?: string,
        @Query('subinventory_code') subinventoryCode?: string,
    ): Promise<{ message: string; success: boolean }> {
        this.logger.log('==== REST API: Clear inventory on hand quantity cache ====');
        this.logger.log(`Item Code: ${itemCode || 'not provided'}, Subinventory Code: ${subinventoryCode || 'not provided'}`);

        try {
            await this.invOnHandQtyService.invalidateInvOnHandQtyCache(itemCode, subinventoryCode);
            
            const message = itemCode || subinventoryCode
                ? `Cache cleared for item ${itemCode || 'all'} in subinventory ${subinventoryCode || 'all'}`
                : 'All inventory on hand quantity caches cleared';

            this.logger.log(message);
            
            return {
                success: true,
                message,
            };
        } catch (error) {
            this.logger.error(
                `REST API Error clearing cache: ${error.message}`,
                error.stack,
            );
            return {
                success: false,
                message: `Error clearing cache: ${error.message}`,
            };
        }
    }
}
