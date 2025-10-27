import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';
import { GetModulesQueryDto } from './dto/get-modules-query.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('modules')
  findAllModules(@Query() query: GetModulesQueryDto) {
    return this.contentService.findAllModules(query.type);
  }
}
