import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvOnHandQtyService } from '../services/inv-on-hand-qty.service';
import {
    InvOnHandQtyResponseDto,
    InvOnHandQtyParamsDto,
} from '../dtos/inv-on-hand-qty.dtos';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
@Internal()
export class InvOnHandQtyMicroserviceController {
    private readonly logger = new Logger(InvOnHandQtyMicroserviceController.name);

    constructor(private readonly invOnHandQtyService: InvOnHandQtyService) { }

    @MessagePattern('ping_inv_on_hand_qty')
    ping() {
        return { status: true, message: 'connected to inventory on hand quantity microservice' };
    }

    @MessagePattern('echo_inv_on_hand_qty')
    echo(@Payload() data: any) {
        this.logger.log(
            'Received echo request with payload inventory on hand quantity microservice',
            data,
        );
        return { status: true, message: 'echo', data };
    }

    @MessagePattern('get_inv_on_hand_qty')
    async getInvOnHandQty(
        @Payload() params?: InvOnHandQtyParamsDto,
    ): Promise<InvOnHandQtyResponseDto> {
        this.logger.log(
            '==== Received request for Oracle inventory on hand quantity with params ====',
        );
        this.logger.log(JSON.stringify(params || {}));

        try {
            const result = await this.invOnHandQtyService.getInvOnHandQtyFromOracle(params);
            this.logger.log(
                `Oracle getInvOnHandQty result: status=${result.status}, count=${result.count}, dataLength=${result.data?.length || 0}`,
            );
            return result;
        } catch (error) {
            this.logger.error(
                `Error retrieving Oracle inventory on hand quantity: ${error.message}`,
                error.stack,
            );
            return {
                data: [],
                count: 0,
                status: false,
                message: `Error in microservice: ${error.message}`,
            };
        }
    }

    @MessagePattern('invalidate_inv_on_hand_qty_cache')
    async invalidateInvOnHandQtyCache(
        @Payload() data?: { itemCode?: string; subinventoryCode?: string },
    ): Promise<{ status: boolean; message: string }> {
        try {
            this.logger.log(
                `Received request to invalidate inventory on hand quantity cache: ${JSON.stringify(data || {})}`,
            );

            await this.invOnHandQtyService.invalidateInvOnHandQtyCache(
                data?.itemCode,
                data?.subinventoryCode,
            );

            return {
                status: true,
                message: data?.itemCode && data?.subinventoryCode
                    ? `Cache invalidated for item ${data.itemCode} in subinventory ${data.subinventoryCode}`
                    : 'All inventory on hand quantity caches invalidated',
            };
        } catch (error) {
            this.logger.error(
                `Error invalidating cache: ${error.message}`,
                error.stack,
            );
            return {
                status: false,
                message: `Error invalidating cache: ${error.message}`,
            };
        }
    }

    // Additional message patterns following the pattern from other microservices
    @MessagePattern('invOnHandQty.findAll')
    @Internal()
    async findAll(@Payload() data: InvOnHandQtyParamsDto) {
        try {
            return await this.invOnHandQtyService.getInvOnHandQtyFromOracle(data);
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }

    @MessagePattern('invOnHandQty.findByItemAndSubinventory')
    @Internal()
    async findByItemAndSubinventory(@Payload() data: { itemCode: string; subinventoryCode: string }) {
        try {
            const params: InvOnHandQtyParamsDto = {
                item_code: data.itemCode,
                subinventory_code: data.subinventoryCode,
            };
            return await this.invOnHandQtyService.getInvOnHandQtyFromOracle(params);
        } catch (error) {
            return {
                success: false,
                error: error.message,
            };
        }
    }
}
