import {
  Controller,
  Post,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { CrudService } from './crud.service';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = (req.query as any).folder
      ? path.resolve((req.query as any).folder)
      : path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (req.query.extensions) {
    const allowed = (req.query.extensions as string).split(',');
    const ext = path.extname(file.originalname).substring(1).toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new BadRequestException('Invalid file extension'), false);
    }
  }
  cb(null, true);
};

@Controller('upload')
export class UploadController {
  constructor(private readonly crudService: CrudService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage,
      fileFilter,
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { language?: string; relatedModule?: string; relatedId?: string },
    @Query('maxSize') maxSize?: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Dynamic size check
    if (maxSize) {
      const maxSizeNum = parseInt(maxSize);
      if (!isNaN(maxSizeNum) && file.size > maxSizeNum) {
        fs.unlinkSync(file.path);
        throw new BadRequestException('File size exceeds limit');
      }
    }

    const { language, relatedModule, relatedId } = body;
    return this.crudService.saveMedia(file, {
      language,
      relatedModule,
      relatedId,
    });
  }
}
