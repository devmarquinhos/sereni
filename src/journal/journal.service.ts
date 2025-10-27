import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateJournalEntryDto } from './dto/create-journal.dto';
import { SortOrder } from './dto/list-journal.dto';

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

  findAllByUserId(userId: string, sort: SortOrder) {
    return this.prisma.journal_entries.findMany({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: sort,
      },
    });
  }
}
