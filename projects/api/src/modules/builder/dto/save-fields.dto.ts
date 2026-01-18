import { IsArray, ValidateNested, IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ModuleFieldDto {
  @IsNumber()
  @IsOptional()
  id?: number | null = null;

  @IsOptional()
  parentFieldId?: number | null;

  @IsString()
  label!: string;

  @IsNumber()
  moduleId!: number;

  @IsNumber()
  componentId!: number;

  @IsNumber()
  sortOrder!: number;

  @IsOptional()
  referenceModuleId?: number | null;

  @IsString()
  name!: string;

  @IsOptional()
  hint?: string;

  @IsOptional()
  isFormField?: boolean;

  @IsOptional()
  isDefault?: boolean;

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
