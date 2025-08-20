import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CurrencyService } from '../services/currency.service';
import { CurrencyQueryDto } from '../dtos/currency.dtos';
import { Internal } from 'src/common/decorators/internal.decorator';

@Controller()
@Internal()
export class CurrencyMicroserviceController {
  constructor(private readonly currencyService: CurrencyService) {}

  @MessagePattern('currency.findAll')
  async findAll(@Payload() dto: CurrencyQueryDto) {
    return this.currencyService.findAllCurrencies(dto);
  }

  @MessagePattern('currency.findByCode')
  async findByCode(@Payload() dto: { code: string }) {
    return this.currencyService.findCurrencyByCode(dto.code);
  }

  @MessagePattern('currency.getCount')
  async getCount(@Payload() dto: CurrencyQueryDto) {
    return this.currencyService.countCurrencies(dto);
  }

  @MessagePattern('currency.findByName')
  async findByName(@Payload() dto: { name: string }) {
    return this.currencyService.findAllCurrencies({ NAME: dto.name });
  }

  @MessagePattern('currency.findByEnabledFlag')
  async findByEnabledFlag(@Payload() dto: { enabledFlag: string }) {
    return this.currencyService.findAllCurrencies({
      ENABLED_FLAG: dto.enabledFlag,
    });
  }
}
