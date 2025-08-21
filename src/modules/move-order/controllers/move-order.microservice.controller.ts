import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MoveOrderService } from '../services/move-order.service';
import {
    CreateMoveOrderDto,
    MoveOrderResponseDto,
    UpdateMoveOrderDto,
    GetMoveOrdersQueryDto,
    CreateMoveOrderLineDto,
    MoveOrderLineResponseDto,
    UpdateMoveOrderLineDto,
    GetMoveOrderLinesQueryDto,
    CreateMoveOrderWithLinesDto,
    MoveOrderWithLinesResponseDto
} from '../dtos/move-order.dtos';

@Controller()
export class MoveOrderMicroserviceController {
    constructor(private readonly moveOrderService: MoveOrderService) { }

    @MessagePattern('move_order.create')
    async createMoveOrder(@Payload() data: { createDto: CreateMoveOrderDto, userId?: number, userName?: string }): Promise<MoveOrderResponseDto> {
        return await this.moveOrderService.createMoveOrder(data.createDto, data.userId, data.userName);
    }

    @MessagePattern('move_order.create_with_lines')
    async createMoveOrderWithLines(@Payload() data: { createDto: CreateMoveOrderWithLinesDto, userId?: number, userName?: string }): Promise<MoveOrderWithLinesResponseDto> {
        return await this.moveOrderService.createMoveOrderWithLines(data.createDto, data.userId, data.userName);
    }

    @MessagePattern('move_order.get_all')
    async getMoveOrders(@Payload() queryDto: GetMoveOrdersQueryDto): Promise<MoveOrderResponseDto[]> {
        return await this.moveOrderService.getMoveOrders(queryDto);
    }

    @MessagePattern('move_order.get_by_id')
    async getMoveOrderById(@Payload() id: number): Promise<MoveOrderResponseDto> {
        return await this.moveOrderService.getMoveOrderById(id);
    }

    @MessagePattern('move_order.update')
    async updateMoveOrder(@Payload() data: { id: number, updateDto: UpdateMoveOrderDto, userId?: number }): Promise<MoveOrderResponseDto> {
        return await this.moveOrderService.updateMoveOrder(data.id, data.updateDto, data.userId);
    }

    @MessagePattern('move_order.delete')
    async deleteMoveOrder(@Payload() id: number): Promise<boolean> {
        return await this.moveOrderService.deleteMoveOrder(id);
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

    @MessagePattern('move_order_line.update')
    async updateMoveOrderLine(@Payload() data: { id: number, updateDto: UpdateMoveOrderLineDto, userId?: number }): Promise<MoveOrderLineResponseDto> {
        return await this.moveOrderService.updateMoveOrderLine(data.id, data.updateDto, data.userId);
    }

    @MessagePattern('move_order_line.delete')
    async deleteMoveOrderLine(@Payload() id: number): Promise<boolean> {
        return await this.moveOrderService.deleteMoveOrderLine(id);
    }
}
