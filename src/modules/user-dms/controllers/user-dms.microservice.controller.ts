import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserDmsService } from '../services/user-dms.service';
import { UserDmsQueryDto } from '../dtos/user-dms.dtos';
import { Internal } from '../../../common/decorators/internal.decorator';

@Controller()
@Internal()
export class UserDmsMicroserviceController {
  constructor(private readonly userDmsService: UserDmsService) {}

  @MessagePattern('user-dms.findAll')
  async findAll(@Payload() dto: UserDmsQueryDto) {
    return this.userDmsService.findAllUserDms(dto);
  }

  @MessagePattern('user-dms.findById')
  async findById(@Payload() dto: { id: number }) {
    return this.userDmsService.findUserDmsById(dto.id);
  }

  @MessagePattern('user-dms.getCount')
  async getCount(@Payload() dto: UserDmsQueryDto) {
    return this.userDmsService.countUserDms(dto);
  }
}
