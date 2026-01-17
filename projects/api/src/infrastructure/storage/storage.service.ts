import { Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

@Injectable()
export class StorageService {
  private defaultUploadDir = path.join(process.cwd(), 'uploads');

  createStorage(customFolder?: string): multer.StorageEngine {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = customFolder
          ? path.resolve(customFolder)
          : this.defaultUploadDir;

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
  }

  createFileFilter(allowedExtensions?: string[]): multer.Options['fileFilter'] {
    return (req, file, cb) => {
      if (allowedExtensions && allowedExtensions.length > 0) {
        const ext = path.extname(file.originalname).substring(1).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          return cb(new Error('Invalid file extension'));
        }
      }
      cb(null, true);
    };
  }

  deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
