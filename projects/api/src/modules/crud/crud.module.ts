import { Module } from '@nestjs/common';
import { CrudController } from './crud.controller';
import { CrudService } from './crud.service';
import { UploadController } from './upload.controller';
import { BuilderModule } from '../builder/builder.module';

@Module({
  imports: [BuilderModule],
  controllers: [CrudController, UploadController],
  providers: [CrudService],
  exports: [CrudService],
})
export class CrudModule {}
