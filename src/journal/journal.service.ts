import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateJournalEntryDto } from './dto/create-journal.dto';

@Injectable()
export class JournalService {
  constructor(private prisma: PrismaService) {}

  create(createJournalEntryDto: CreateJournalEntryDto, userId: string) {
    const { mood_rating, entry_text } = createJournalEntryDto;

    return this.prisma.journal_entries.create({
      data: {
        mood_rating,
        entry_text,
        user_id: userId,
      },
    });
  }
}
