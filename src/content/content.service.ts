import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { module_type } from '@prisma/client';

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
}
