import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { BuilderService } from './builder.service';
import { SaveFieldsDto } from './dto/save-fields.dto';
import { MigrateDto } from './dto/migrate.dto';
import { JwtAuthGuard } from '../../shared/guards';

@Controller('builder')
export class BuilderController {
  constructor(private readonly builderService: BuilderService) {}

  @Post('save-fields')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async saveFields(@Body() dto: SaveFieldsDto) {
    return this.builderService.saveFields(dto.fields);
  }

  @Post('migrate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async migrate(@Body() dto: MigrateDto) {
    return this.builderService.migrate(dto.module);
  }
}
