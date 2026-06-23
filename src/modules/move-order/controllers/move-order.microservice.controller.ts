import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MoveOrderService } from '../services/move-order.service';
import {
    CreateMoveOrderDto,
    MoveOrderResponseDto,
    GetMoveOrdersQueryDto,
    CreateMoveOrderLineDto,
    MoveOrderLineResponseDto,
    GetMoveOrderLinesQueryDto,
    CreateMoveOrderWithLinesDto,
    MoveOrderWithLinesResponseDto,
    FindMoveOrderByRequestNumberDto,
    MoveOrderFindWithLinesResponseDto,
} from '../dtos';

@Controller()
export class MoveOrderMicroserviceController {
    constructor(private readonly moveOrderService: MoveOrderService) { }

    @MessagePattern('move_order.create_with_lines')
    async createMoveOrderWithLines(
        @Payload()
        data:
            | { createDto: CreateMoveOrderWithLinesDto; userId?: number; userName?: string }
            | (CreateMoveOrderWithLinesDto & { userId?: number; userName?: string }),
    ): Promise<MoveOrderWithLinesResponseDto> {
        const payload = data as any;
        const createDto: CreateMoveOrderWithLinesDto = payload.createDto ?? payload;
        const userId = payload.userId;
        const userName = payload.userName;
        return await this.moveOrderService.createMoveOrderWithLines(
            createDto,
            userId,
            userName,
        );
    }

    @MessagePattern('move_order.find_by_request_number')
    async findMoveOrderWithLinesByRequestNumber(
        @Payload() payload: FindMoveOrderByRequestNumberDto,
    ): Promise<MoveOrderFindWithLinesResponseDto> {
        return this.moveOrderService.findMoveOrderWithLinesByRequestNumber(
            payload.request_number,
            payload.source_system,
        );
    }

    @MessagePattern('move_order.get_all')
    async getMoveOrders(@Payload() queryDto: GetMoveOrdersQueryDto): Promise<MoveOrderResponseDto[]> {
        return await this.moveOrderService.getMoveOrders(queryDto);
    }

    @MessagePattern('move_order.get_by_id')
    async getMoveOrderById(@Payload() id: number): Promise<MoveOrderResponseDto> {
        return await this.moveOrderService.getMoveOrderById(id);
    }

    @MessagePattern('move_order_line.create')
    async createMoveOrderLine(@Payload() data: { createDto: CreateMoveOrderLineDto, userId?: number, userName?: string }): Promise<MoveOrderLineResponseDto> {
        return await this.moveOrderService.createMoveOrderLine(data.createDto, data.userId, data.userName);
    }

    @MessagePattern('move_order_line.get_all')
    async getMoveOrderLines(@Payload() queryDto: GetMoveOrderLinesQueryDto): Promise<MoveOrderLineResponseDto[]> {
        return await this.moveOrderService.getMoveOrderLines(queryDto);
    }

    @MessagePattern('move_order_line.get_by_id')
    async getMoveOrderLineById(@Payload() id: number): Promise<MoveOrderLineResponseDto> {
        return await this.moveOrderService.getMoveOrderLineById(id);
    }

    @MessagePattern('move_order_line.get_by_header_id')
    async getMoveOrderLinesByHeaderId(@Payload() headerId: number): Promise<MoveOrderLineResponseDto[]> {
        return await this.moveOrderService.getMoveOrderLinesByHeaderId(headerId);
    }

    @MessagePattern('move_order_line.delete')
    async deleteMoveOrderLine(@Payload() id: number): Promise<boolean> {
        return await this.moveOrderService.deleteMoveOrderLine(id);
    }
}
