import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PsychologistsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.psychologist.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }
}
