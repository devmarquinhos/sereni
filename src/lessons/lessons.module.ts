// src/lessons/lessons.module.ts
import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaModule } from 'prisma/prisma.module'; // 👈 Importante! Ajuste o caminho se necessário

@Module({
  imports: [PrismaModule], // 👈 Sem isso, dá erro de injeção de dependência
  controllers: [LessonsController],
  providers: [LessonsService],
})
export class LessonsModule {}
