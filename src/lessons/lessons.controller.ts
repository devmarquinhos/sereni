// src/lessons/lessons.controller.ts
import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  // Rota: GET /lessons/1
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonsService.findOne(id);
  }
}
