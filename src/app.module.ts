import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from 'prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { JournalModule } from './journal/journal.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    HealthModule,
    JournalModule,
    ContentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
