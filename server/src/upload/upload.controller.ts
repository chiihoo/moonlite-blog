import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createWriteStream } from 'fs';
import { join, parse } from 'path';
import { nanoid } from 'nanoid';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file) {
    return new Promise((resolve, reject) => {
      const filename = nanoid() + parse(file.originalname).ext;
      const ws = createWriteStream(
        // __dirname为\server\dist\upload
        join(__dirname, '../../', 'public', filename),
      );

      ws.on('open', () => {
        ws.write(file.buffer);
        ws.end();
      });

      ws.on('finish', () => {
        resolve(`http://localhost:3005/${filename}`);
      });

      // 需要在app.module.ts中添加以下代码，才能访问服务器中的静态文件
      // ServeStaticModule.forRoot({
      //   rootPath: join(__dirname, '..', 'public'),
      // }),
    });
  }
}
