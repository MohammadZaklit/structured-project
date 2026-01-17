import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsOptional()
  oldPassword?: string;

  @IsString()
  @MinLength(6)
  newPassword!: string;

  @IsBoolean()
  @IsOptional()
  isReset?: boolean;

  @IsString()
  @IsOptional()
  resetToken?: string;
}
