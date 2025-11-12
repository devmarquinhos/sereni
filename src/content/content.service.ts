import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { module_type } from '@prisma/client';
import { CreateModuleDto } from './dto/create-module.dto';
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

  async createStep(createStepDto: CreateStepDto) {
    const { lesson_id, step_type, content, order } = createStepDto;

    const lessonExists = await this.prisma.lessons.findUnique({
      where: { id: lesson_id },
    });

    if (!lessonExists) {
      throw new Error(`Lição com ID ${lesson_id} não encontrada.`);
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
}
