/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
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

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: '"Equipe Sereni" <seu-email@gmail.com>',
      to: user.email,
      subject: 'Sereni - Código de Recuperação de Senha',
      html: `
        <h2>Olá, ${user.name || 'usuário'}!</h2>
        <p>Você solicitou a recuperação de senha do Sereni.</p>
        <p>Seu código de verificação é: <strong>${resetToken}</strong></p>
        <p>Este código é válido por 30 minutos.</p>
        <br/>
        <p>Se não foi você, apenas ignore este e-mail.</p>
      `,
    });

    return { message: 'Se o e-mail existir, as instruções serão enviadas.' };
  }
}
