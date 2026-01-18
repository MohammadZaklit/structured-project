import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CrudService } from './crud.service';
import { BuilderService } from '../builder/builder.service';
import { JwtAuthGuard } from '../../shared/guards';

@Controller()
export class CrudController {
  constructor(
    private readonly crudService: CrudService,
    private readonly builderService: BuilderService,
  ) {}

  @Get(':moduleName')
  @UseGuards(JwtAuthGuard)
  async getRecords(
    @Param('moduleName') moduleName: string,
    @Query() searchParams: Record<string, any>,
  ) {
    return this.crudService.getRecords(moduleName, searchParams);
  }

  @Get(':moduleName/:id')
  @UseGuards(JwtAuthGuard)
  async getRecord(@Param('moduleName') moduleName: string, @Param('id') id: number) {
    return this.crudService.getRecord(moduleName, id);
  }

  @Post(':moduleName')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createRecord(
    @Param('moduleName') moduleName: string,
    @Body() payload: Record<string, any>,
  ) {
    return this.crudService.createRecord(moduleName, payload);
  }

  @Put(':moduleName/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateRecord(
    @Param('moduleName') moduleName: string,
    @Param('id') id: number,
    @Body() payload: Record<string, any>,
  ) {
    return this.crudService.updateRecord(moduleName, id, payload);
  }

  @Delete(':moduleName/:id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteRecord(@Param('moduleName') moduleName: string, @Param('id') id: number) {
    // If deleting a module or module_field, generate drop migration first
    if (moduleName === 'modules' || moduleName === 'module_fields') {
      const record = await this.crudService.getRecordRaw(moduleName, id);
      if (record) {
        const type = moduleName === 'modules' ? 'module' : 'field';
        await this.builderService.generateDropMigration(type, record);
      }
    }

    return this.crudService.deleteRecord(moduleName, id);
  }

  @Post('sort/:moduleName')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async sortRecords(
    @Param('moduleName') moduleName: string,
    @Body() payload: { page: number; rows: Array<{ id: number; sortOrder: number }> },
  ) {
    return this.crudService.sortRecords(moduleName, payload);
  }
}
