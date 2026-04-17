import {
    Controller,
    Get,
    Query,
    Delete,
    Logger,
    HttpCode,
    HttpStatus,
    BadRequestException,
} from '@nestjs/common';
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

    @Get('by-organization')
    @ApiOperation({
        summary: 'Get inventory on hand quantity by organization',
        description:
            'Same as the main inventory endpoint, but requires organization_code to filter by inventory organization (e.g. CWH, branch code). Optional item_code and subinventory_code filters apply.',
    })
    @ApiQuery({
        name: 'organization_code',
        required: true,
        type: String,
        description: 'Organization code to filter (maps to ORGANIZATION_CODE on the view)',
        example: 'CWH',
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
        description: 'Bad request - organization_code is required',
    })
    async getInvOnHandQtyByOrganization(
        @Query('organization_code') organizationCode: string,
        @Query('item_code') itemCode?: string,
        @Query('subinventory_code') subinventoryCode?: string,
    ): Promise<InvOnHandQtyResponseDto> {
        this.logger.log('==== REST API: Get inventory on hand quantity by organization ====');
        this.logger.log(
            `Organization Code: ${organizationCode || 'not provided'}, Item Code: ${itemCode || 'not provided'}, Subinventory Code: ${subinventoryCode || 'not provided'}`,
        );

        if (!organizationCode?.trim()) {
            throw new BadRequestException('organization_code is required');
        }

        try {
            const params: InvOnHandQtyParamsDto = {
                organization_code: organizationCode.trim(),
                item_code: itemCode,
                subinventory_code: subinventoryCode,
            };

            const result = await this.invOnHandQtyService.getInvOnHandQtyFromOracle(params);

            this.logger.log(
                `REST API getInvOnHandQtyByOrganization result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
            );

            return result;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(
                `REST API Error retrieving inventory on hand quantity by organization: ${error.message}`,
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

    @Get('locator')
    @ApiOperation({
        summary: 'Get inventory locator list',
        description:
            'Retrieve unique locator list (SUBINVENTORY_CODE, LOCATOR_ID, LOCATOR) filtered by organization_code and optional subinventory_code. Defaults to JAT when organization_code is omitted.',
    })
    @ApiQuery({
        name: 'organization_code',
        required: false,
        type: String,
        description: 'Organization code to filter locator data (default: JAT)',
        example: 'JAT',
    })
    @ApiResponse({
        status: 200,
        description: 'Inventory locator data retrieved successfully',
    })
    @ApiQuery({
        name: 'subinventory_code',
        required: false,
        type: String,
        description: 'Subinventory code to filter locator data',
        example: 'GOOD-RK-1',
    })
    async getInvLocator(
        @Query('organization_code') organizationCode?: string,
        @Query('subinventory_code') subinventoryCode?: string,
    ): Promise<any> {
        this.logger.log('==== REST API: Get inventory locator list ====');
        this.logger.log(
            `Organization Code: ${organizationCode || 'JAT (default)'}, Subinventory Code: ${subinventoryCode || 'not provided'}`,
        );

        try {
            return await this.invOnHandQtyService.getInvLocator({
                organization_code: organizationCode,
                subinventory_code: subinventoryCode,
            });
        } catch (error) {
            this.logger.error(
                `REST API Error retrieving inventory locator list: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving locator data: ${error.message}`,
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
    @ApiQuery({
        name: 'organization_code',
        required: false,
        type: String,
        description: 'Organization code segment of the cache key (defaults to CWH when omitted)',
        example: 'CWH',
    })
    @ApiResponse({
        status: 200,
        description: 'Cache cleared successfully',
    })
    async clearCache(
        @Query('item_code') itemCode?: string,
        @Query('subinventory_code') subinventoryCode?: string,
        @Query('organization_code') organizationCode?: string,
    ): Promise<{ message: string; success: boolean }> {
        this.logger.log('==== REST API: Clear inventory on hand quantity cache ====');
        this.logger.log(
            `Organization Code: ${organizationCode || 'not provided'}, Item Code: ${itemCode || 'not provided'}, Subinventory Code: ${subinventoryCode || 'not provided'}`,
        );

        try {
            await this.invOnHandQtyService.invalidateInvOnHandQtyCache(
                itemCode,
                subinventoryCode,
                organizationCode,
            );
            
            const message =
                itemCode || subinventoryCode || organizationCode
                    ? `Cache cleared for org ${organizationCode || 'CWH'}, item ${itemCode || 'all'}, subinventory ${subinventoryCode || 'all'}`
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
