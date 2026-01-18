import { Module } from '@nestjs/common';
import { BuilderController } from './builder.controller';
import { BuilderService } from './builder.service';
import { MigrationGeneratorService } from './services/migration-generator.service';

@Module({
  controllers: [BuilderController],
  providers: [BuilderService, MigrationGeneratorService],
  exports: [BuilderService, MigrationGeneratorService],
})
export class BuilderModule {}
