import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { UserDmsController } from './controllers/user-dms.controller';
import { UserDmsService } from './services/user-dms.service';

@Module({
  imports: [CommonModule],
  controllers: [UserDmsController],
  providers: [UserDmsService],
  exports: [UserDmsService],
})
export class UserDmsModule {}
