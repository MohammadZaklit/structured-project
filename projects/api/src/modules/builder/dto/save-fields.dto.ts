import { IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ModuleFieldDto {
  @IsNumber()
  @IsOptional()
  id: number | null = null;

  @IsOptional()
  parentFieldId?: number | null;

  label!: string;

  moduleId!: number;

  componentId!: number;

  sortOrder!: number;

  @IsOptional()
  referenceModuleId?: number | null;

  name!: string;

  @IsOptional()
  hint?: string;

  @IsOptional()
  isFormField?: boolean;

  @IsOptional()
  isDeleted?: boolean;

  @IsOptional()
  configuration?: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleFieldDto)
  @IsOptional()
  children?: ModuleFieldDto[];
}

export class SaveFieldsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleFieldDto)
  fields!: ModuleFieldDto[];
}
