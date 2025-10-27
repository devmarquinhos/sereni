/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JournalService } from './journal.service';
import { CreateJournalEntryDto } from './dto/create-journal.dto';
import { GetJournalQueryDto, SortOrder } from './dto/list-journal.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('journal')
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Post()
  create(
    @Body() createJournalEntryDto: CreateJournalEntryDto,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.journalService.create(createJournalEntryDto, userId);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: GetJournalQueryDto) {
    const userId = req.user.id;
    const sortOrder = query.sort || SortOrder.DESC;

    return this.journalService.findAllByUserId(userId, sortOrder);
  }
}
