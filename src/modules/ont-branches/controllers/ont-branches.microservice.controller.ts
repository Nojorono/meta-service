import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Internal } from 'src/common/decorators/internal.decorator';
import { OntBranchesService } from '../services/ont-branches.service';

@Controller()
@Internal()
export class OntBranchesMicroserviceController {
  constructor(private readonly ontBranchesService: OntBranchesService) {}

  @MessagePattern('ont-branches.findAll')
  async findAll() {
    return this.ontBranchesService.findAll();
  }
}
