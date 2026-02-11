import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { JournalModule } from './journal/journal.module';
import { ContentModule } from './content/content.module';
import { ProgressModule } from './progress/progress.module';
import { TasksModule } from './tasks/tasks.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    HealthModule,
    JournalModule,
    ContentModule,
    ProgressModule,
    TasksModule,
    LessonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
