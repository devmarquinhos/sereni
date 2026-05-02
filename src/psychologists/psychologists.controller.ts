import { Controller, Get, UseGuards } from '@nestjs/common';
import { PsychologistsService } from './psychologists.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('psychologists')
@UseGuards(AuthGuard)
export class PsychologistsController {
  constructor(private readonly psychologistsService: PsychologistsService) {}

  @Get()
  findAll() {
    return this.psychologistsService.findAll();
  }
}
