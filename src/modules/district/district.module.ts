import { Module } from '@nestjs/common';
import { DistrictController } from './controllers/district.controller';
import { DistrictService } from './services/district.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictMetaModule {}
