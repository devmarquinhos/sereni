import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class ResetPasswordDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @Length(6, 6, { message: 'O código deve ter exatamente 6 dígitos.' })
  code: string;

  @IsString()
  @MinLength(6, { message: 'A nova senha deve ter no mínimo 6 caracteres.' })
  newPassword: string;
}
