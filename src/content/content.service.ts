import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { module_type } from '@prisma/client';
import { CreateModuleDto } from './dto/create-module.dto';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { CreateStepDto } from './dto/create-step.dto';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  async findAllModules(type?: module_type) {
    const whereClause = type ? { type } : {};

    return this.prisma.modules.findMany({
      where: whereClause,
      orderBy: {
        id: 'asc',
      },
    });
  }

  createModule(createModuleDto: CreateModuleDto) {
    return this.prisma.modules.create({
      data: createModuleDto,
    });
  }

  async createLesson(createLessonDto: CreateLessonDto) {
    const { title, order, module_id } = createLessonDto;

    const moduleExists = await this.prisma.modules.findUnique({
      where: { id: module_id },
    });

    if (!moduleExists) {
      throw new NotFoundException(`Módulo com ID ${module_id} não encontrado.`);
    }

    return this.prisma.lessons.create({
      data: {
        title,
        order,
        module_id,
      },
    });
  }

  async createStep(createStepDto: CreateStepDto) {
    const { lesson_id, step_type, content, order } = createStepDto;

    const lessonExists = await this.prisma.lessons.findUnique({
      where: { id: lesson_id },
    });

    if (!lessonExists) {
      throw new NotFoundException(`Lição com ID ${lesson_id} não encontrada.`);
    }

    return this.prisma.lesson_steps.create({
      data: {
        lesson_id,
        step_type,
        content,
        order,
      },
    });
  }

  async findLessonsByModuleId(moduleId: number) {
    const moduleExists = await this.prisma.modules.findUnique({
      where: { id: moduleId },
    });

    if (!moduleExists) {
      throw new NotFoundException(`Módulo com ID ${moduleId} não encontrado.`);
    }

    return this.prisma.lessons.findMany({
      where: { module_id: moduleId },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async findStepsByLessonId(lessonId: number) {
    const lessonExists = await this.prisma.lessons.findUnique({
      where: { id: lessonId },
    });

    if (!lessonExists) {
      throw new NotFoundException(`Lição com ID ${lessonId} não encontrada.`);
    }

    const steps = await this.prisma.lesson_steps.findMany({
      where: { lesson_id: lessonId },
      orderBy: {
        order: 'asc',
      },
    });

    return steps;
  }

  async findLessonWithSteps(id: number) {
    const lesson = await this.prisma.lessons.findUnique({
      where: { id },
      include: {
        lesson_steps: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!lesson) throw new NotFoundException('Lição não encontrada');
    return lesson;
  }
}
