import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { lesson_step_type } from '@prisma/client';
import { Type } from 'class-transformer';

class ContentDto {}

export class CreateStepDto {
  @IsNumber()
  @IsNotEmpty()
  lesson_id: number;

  @IsEnum(lesson_step_type)
  @IsNotEmpty()
  step_type: lesson_step_type;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ContentDto)
  content: object;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
