// src/lessons/lessons.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; // Ajuste o import conforme seu projeto

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: number) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id },
      include: {
        // Aqui está a mágica: trazemos os passos juntos
        lesson_steps: {
          orderBy: { order: 'asc' }, // Garante a ordem (Pergunta 1, 2, 3...)
        },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lição com ID ${id} não encontrada.`);
    }

    return lesson;
  }
}
