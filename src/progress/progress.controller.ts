/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProgressService } from './progress.service';

@UseGuards(AuthGuard('jwt')) // Protege todas as rotas de progresso
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('steps/:id/complete')
  completeStep(@Req() req: any, @Param('id', ParseIntPipe) stepId: number) {
    const userId = req.user.id;
    return this.progressService.completeStep(userId, stepId);
  }

  @Get('lessons/:id/steps')
  getLessonProgress(
    @Req() req: any,
    @Param('id', ParseIntPipe) lessonId: number,
  ) {
    const userId = req.user.id;
    return this.progressService.getLessonProgress(userId, lessonId);
  }
}
