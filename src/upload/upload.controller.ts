import {
  Controller,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { AuthUserId } from 'src/auth/constants/auth-user-id.type';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post(':dir')
  @UseInterceptors(FilesInterceptor('files')) // File"s" Interceptor가 될 필요?
  async uploadFile(
    @AuthUser() user: AuthUserId,
    @Param('dir')
    dir: string,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<string[]> {
    return this.uploadService.uploadFiles(user.userId, dir, files);
  }
}
