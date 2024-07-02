import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../service/cloudinary.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('image')
@Controller({
  version: '1',
  path: '/image',
})
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: any): Promise<any> {
    return await this.cloudinaryService.uploadImage(file.path);
  }

  @Get('optimize')
  getOptimizedUrl(): string {
    return this.cloudinaryService.getOptimizedUrl('shoes');
  }

  @Get('crop')
  getAutoCroppedUrl(): string {
    return this.cloudinaryService.getAutoCroppedUrl('shoes');
  }
}
