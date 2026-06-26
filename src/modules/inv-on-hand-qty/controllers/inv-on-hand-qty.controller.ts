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
    InvOnHandQtyWithAtrResponseDto,
    LocatorSalesParamsDto,
} from '../dtos/inv-on-hand-qty.dtos';
import { Public } from '../../../decorators/public.decorator';

@ApiTags('Inventory On Hand Quantity')
@Controller('inv-on-hand-qty')
@Public()
export class InvOnHandQtyController {
    private readonly logger = new Logger(InvOnHandQtyController.name);

    constructor(private readonly invOnHandQtyService: InvOnHandQtyService) { }

    private normalizeSubinventoryCodes(
        subinventoryCode?: string | string[],
    ): string[] {
        if (!subinventoryCode) {
            return [];
        }

        const rawValues = Array.isArray(subinventoryCode)
            ? subinventoryCode
            : [subinventoryCode];

        return [
            ...new Set(
                rawValues
                    .flatMap((value) => value.split(','))
                    .map((value) => value.trim())
                    .filter(Boolean),
            ),
        ];
    }

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
            'Same as the main inventory endpoint, but requires organization_code to filter by inventory organization (e.g. CWH, branch code). Optional item_code and one or more subinventory_code filters apply.',
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
        isArray: true,
        type: String,
        description:
            'Subinventory code(s). Repeat param or comma-separated (e.g. GOOD-RK-1,GOOD-RK-2)',
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
        @Query('subinventory_code') subinventoryCode?: string | string[],
    ): Promise<InvOnHandQtyResponseDto> {
        const subinventoryCodes = this.normalizeSubinventoryCodes(subinventoryCode);

        this.logger.log('==== REST API: Get inventory on hand quantity by organization ====');
        this.logger.log(
            `Organization Code: ${organizationCode || 'not provided'}, Item Code: ${itemCode || 'not provided'}, Subinventory Codes: ${subinventoryCodes.join(', ') || 'not provided'}`,
        );

        if (!organizationCode?.trim()) {
            throw new BadRequestException('organization_code is required');
        }

        try {
            const params: InvOnHandQtyParamsDto = {
                organization_code: organizationCode.trim(),
                item_code: itemCode,
                subinventory_code:
                    subinventoryCodes.length > 0 ? subinventoryCodes : undefined,
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
    @ApiQuery({
        name: 'locator',
        required: false,
        type: String,
        description: 'Locator segment1 to filter locator data',
        example: 'A.01.01',
    })
    async getInvLocator(
        @Query('organization_code') organizationCode?: string,
        @Query('subinventory_code') subinventoryCode?: string,
        @Query('locator') locator?: string,
    ): Promise<any> {
        this.logger.log('==== REST API: Get inventory locator list ====');
        this.logger.log(
            `Organization Code: ${organizationCode || 'JAT (default)'}, Subinventory Code: ${subinventoryCode || 'not provided'}, Locator: ${locator || 'not provided'}`,
        );

        try {
            return await this.invOnHandQtyService.getInvLocator({
                organization_code: organizationCode,
                subinventory_code: subinventoryCode,
                locator,
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

    // on hand mapping detail
    @Get('on-hand-mapping-detail')
    @ApiOperation({
        summary: 'Get on hand mapping detail',
        description:
            'Header from XTD_INV_ON_HAND_QTY_V matched to MTL_ONHAND_QUANTITIES_DETAIL lines by ITEM_CODE (default org CWH, subinventory SELISIH)',
    })
    @ApiQuery({
        name: 'organization_code',
        required: false,
        type: String,
        description: 'Organization code filter for header and detail',
        example: 'CWH',
    })
    @ApiQuery({
        name: 'subinventory_code',
        required: false,
        type: String,
        description: 'Subinventory code filter for header and detail',
        example: 'SELISIH',
    })
    async getOnHandMappingDetail(
        @Query('organization_code') organizationCode?: string,
        @Query('subinventory_code') subinventoryCode?: string,
    ): Promise<any> {
        this.logger.log('==== REST API: Get on hand mapping detail ====');
        this.logger.log(
            `Organization Code: ${organizationCode || 'CWH (default)'}, Subinventory Code: ${subinventoryCode || 'SELISIH (default)'}`,
        );

        try {
            return await this.invOnHandQtyService.getOnHandMappingDetail({
                organization_code: organizationCode,
                subinventory_code: subinventoryCode,
            });
        } catch (error) {
            this.logger.error(
                `REST API Error retrieving on hand mapping detail: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error retrieving on hand mapping detail: ${error.message}`,
            };
        }
    }

    @Get('with-atr')
    @ApiOperation({
        summary: 'Get inventory on hand quantity with attributes',
        description:
            'Retrieve rows from XTD_INV_ON_HAND_QTY_WITH_ATR_V filtered by organization_code and subinventory_code',
    })
    @ApiQuery({
        name: 'organization_code',
        required: true,
        type: String,
        description: 'Organization code to filter',
        example: 'CWH',
    })
    @ApiQuery({
        name: 'subinventory_code',
        required: true,
        isArray: true,
        type: String,
        description:
            'Subinventory code(s). Repeat param or comma-separated (e.g. GOOD-RK-1,GOOD-RK-2)',
        example: 'GOOD-RK-1',
    })
    @ApiResponse({
        status: 200,
        description: 'Inventory on hand quantity with attributes retrieved successfully',
        type: InvOnHandQtyWithAtrResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Bad request - organization_code and subinventory_code are required',
    })
    async getInvOnHandQtyWithAtr(
        @Query('organization_code') organizationCode: string,
        @Query('subinventory_code') subinventoryCode: string | string[],
    ): Promise<InvOnHandQtyWithAtrResponseDto> {
        const subinventoryCodes = this.normalizeSubinventoryCodes(subinventoryCode);

        this.logger.log('==== REST API: Get inventory on hand quantity with attributes ====');
        this.logger.log(
            `Organization Code: ${organizationCode || 'not provided'}, Subinventory Codes: ${subinventoryCodes.join(', ') || 'not provided'}`,
        );

        if (!organizationCode?.trim()) {
            throw new BadRequestException('organization_code is required');
        }

        if (subinventoryCodes.length === 0) {
            throw new BadRequestException('subinventory_code is required');
        }

        try {
            return await this.invOnHandQtyService.getInvOnHandQtyWithAtr({
                organization_code: organizationCode.trim(),
                subinventory_code: subinventoryCodes,
            });
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            this.logger.error(
                `REST API Error retrieving inventory on hand quantity with attributes: ${error.message}`,
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

    // find locator sales
    @Get('locator-sales')
    @ApiOperation({
        summary: 'Find locator sales',
        description:
            'Retrieve salesrep data from XTD_ONT_SALESREPS_V filtered by organization_code and salesrep_number',
    })
    @ApiQuery({
        name: 'organization_code',
        required: true,
        type: String,
        description: 'Organization code filter',
        example: 'JAT',
    })
    @ApiQuery({
        name: 'salesrep_number',
        required: true,
        type: String,
        description: 'Sales representative number filter',
        example: '1000123',
    })
    @ApiResponse({
        status: 200,
        description: 'Locator sales data retrieved successfully',
    })
    async getLocatorSales(
        @Query('organization_code') organizationCode: string,
        @Query('salesrep_number') salesrepNumber: string,
    ): Promise<any> {
        if (!organizationCode?.trim() || !salesrepNumber?.trim()) {
            throw new BadRequestException(
                'organization_code and salesrep_number are required',
            );
        }

        const params: LocatorSalesParamsDto = {
            organization_code: organizationCode.trim(),
            salesrep_number: salesrepNumber.trim(),
        };

        return this.invOnHandQtyService.getLocatorSales(params);
    }
}
