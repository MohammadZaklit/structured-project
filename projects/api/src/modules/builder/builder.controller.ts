import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseArrayPipe,
} from '@nestjs/common';
import { BuilderService, ModuleField } from './builder.service';
import { ModuleFieldDto, SaveFieldsDto } from './dto/save-fields.dto';
import { MigrateDto } from './dto/migrate.dto';
import { JwtAuthGuard } from '../../shared/guards';

@Controller('builder')
export class BuilderController {
  constructor(private readonly builderService: BuilderService) {}

  @Post('save-fields')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async saveFields(
    @Body(
      new ParseArrayPipe({
        items: ModuleFieldDto,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    fields: ModuleFieldDto[],
  ) {
    return this.builderService.saveFields(fields as ModuleField[]);
  }

  @Post('migrate')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async migrate(@Body() dto: MigrateDto) {
    return this.builderService.migrate(dto.module);
  }
}
