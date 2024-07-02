import { Module } from '@nestjs/common';
import { CloudinaryController } from './controllers/cloudinary.controller';
import { CloudinaryService } from './service/cloudinary.service';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [CloudinaryController],
  imports: [],
  providers: [CloudinaryService, ConfigService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
