import { Module } from '@nestjs/common';
import { SubDistrictController } from './controllers/sub-district.controller';
import { SubDistrictService } from './services/sub-district.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [SubDistrictController],
  providers: [SubDistrictService],
  exports: [SubDistrictService],
})
export class SubDistrictMetaModule {}
