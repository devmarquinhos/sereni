/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(12, { message: 'A senha deve ter no mínimo 12 caracteres.' })
  @MaxLength(60, { message: 'A senha deve ter no máximo 60 caracteres.' })
  @IsNotEmpty()
  password: string;
}
