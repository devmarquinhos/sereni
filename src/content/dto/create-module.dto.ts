import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { module_type } from '@prisma/client';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(module_type)
  @IsNotEmpty()
  type: module_type;
}
