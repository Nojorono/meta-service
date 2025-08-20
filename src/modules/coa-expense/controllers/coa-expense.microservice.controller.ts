import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CoaExpenseService } from '../services/coa-expense.service';
import { CoaExpenseQueryDto } from '../dtos/coa-expense.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class CoaExpenseMicroserviceController {
  constructor(private readonly coaExpenseService: CoaExpenseService) {}

  @MessagePattern('coa-expense.findAll')
  async findAll(@Payload() dto: CoaExpenseQueryDto) {
    return this.coaExpenseService.findAllCoaExpenses(dto);
  }

  @MessagePattern('coa-expense.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.coaExpenseService.findCoaExpenseById(dto.id);
  }

  @MessagePattern('coa-expense.getCount')
  async getCount(@Payload() dto: CoaExpenseQueryDto) {
    return this.coaExpenseService.countCoaExpenses(dto);
  }
}
