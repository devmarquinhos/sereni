/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtService } from '@nestjs/jwt';
import { Resend } from 'resend';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
@Injectable()
export class AuthService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const userExists = await this.prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new ConflictException('O e-mail informado já está em uso.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.prisma.users.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
      },
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) {
      return { message: 'Se o e-mail existir, as instruções serão enviadas.' };
    }

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        reset_token: resetToken,
        reset_token_expires_at: resetTokenExpiresAt,
      },
    });

    try {
      await this.resend.emails.send({
        from: 'Sereni Support <onboarding@resend.dev>',
        to: user.email,
        subject: 'Seu código de recuperação - Sereni',
        html: `
          <div style="font-family: sans-serif; color: #333;">
            <h2>Olá, ${user.name || 'usuário'}!</h2>
            <p>Você solicitou a recuperação de senha do Sereni.</p>
            <p>Seu código de verificação é:</p>
            <h1 style="color: #4F46E5; letter-spacing: 5px;">${resetToken}</h1>
            <p>Este código é válido por 30 minutos.</p>
            <hr />
            <p style="font-size: 12px; color: #666;">Se não foi você, apenas ignore este e-mail.</p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Erro ao enviar via Resend:', error);
    }

    return { message: 'Se o e-mail existir, as instruções serão enviadas.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { email, code, newPassword } = resetPasswordDto;
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user || !user.reset_token || !user.reset_token_expires_at) {
      throw new BadRequestException(
        'Solicitação de recuperação inválida ou expirada.',
      );
    }

    const isTokenValid = user.reset_token === code;
    const isTokenExpired = new Date() > user.reset_token_expires_at;

    if (!isTokenValid || isTokenExpired) {
      throw new BadRequestException('Código inválido ou expirado.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        password_hash: hashedPassword,
        reset_token: null,
        reset_token_expires_at: null,
      },
    });

    return { message: 'Senha alterada com sucesso!' };
  }
}
