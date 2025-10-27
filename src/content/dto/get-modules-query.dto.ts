import { IsEnum, IsOptional } from 'class-validator';
import { module_type } from '@prisma/client';

export class GetModulesQueryDto {
  @IsEnum(module_type)
  @IsOptional()
  type?: module_type;
}
