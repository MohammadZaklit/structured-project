import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class ModuleInfoDto {
  @IsNumber()
  id!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  label!: string;
}

export class MigrateDto {
  @ValidateNested()
  @Type(() => ModuleInfoDto)
  module!: ModuleInfoDto;
}
