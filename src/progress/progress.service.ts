import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ProgressService {
  constructor(private prisma: PrismaService) {}

  async completeStep(userId: string, stepId: number) {
    const stepExists = await this.prisma.lesson_steps.findUnique({
      where: { id: stepId },
    });

    if (!stepExists) {
      throw new NotFoundException(`Passo com ID ${stepId} não encontrado.`);
    }

    return this.prisma.user_progress.create({
      data: {
        user_id: userId,
        lesson_step_id: stepId,
      },
    });
  }

  async getLessonProgress(userId: string, lessonId: number) {
    const completedSteps = await this.prisma.user_progress.findMany({
      where: {
        user_id: userId,
        lesson_steps: {
          lesson_id: lessonId,
        },
      },
      select: {
        lesson_step_id: true,
        completed_at: true,
      },
    });

    return completedSteps;
  }
}
