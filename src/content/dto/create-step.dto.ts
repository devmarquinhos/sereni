import { IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { lesson_step_type } from '@prisma/client';

export class CreateStepDto {
  @IsNumber()
  @IsNotEmpty()
  lesson_id: number;

  @IsEnum(lesson_step_type)
  @IsNotEmpty()
  step_type: lesson_step_type;

  @IsObject()
  @IsNotEmpty()
  content: object;

  @IsNumber()
  @IsNotEmpty()
  order: number;
}
