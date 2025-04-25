import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { Public } from 'src/decorators/public.decorator';
import { TypeormService } from 'src/common/services/typeorm.service';

@Controller({
  version: VERSION_NEUTRAL,
  path: '/',
})
export class AppController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeormService: TypeormService,
  ) {}

  @Get('/health')
  @HealthCheck()
  @Public()
  public async getHealth() {
    return this.healthCheckService.check([
      () => this.typeormService.isHealthy(),
    ]);
  }
}
