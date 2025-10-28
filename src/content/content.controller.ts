import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ContentService } from './content.service';
import { GetModulesQueryDto } from './dto/get-modules-query.dto';
import { CreateModuleDto } from './dto/create-module.dto'; // Importe o DTO
import { Roles } from '../common/decorators/roles.decorator'; // Importe o Decorator
import { RolesGuard } from '../common/guards/roles.guards'; // Importe o Guard

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('modules')
  findAllModules(@Query() query: GetModulesQueryDto) {
    return this.contentService.findAllModules(query.type);
  }

  @Post('modules')
  @Roles('ADMIN')
  createModule(@Body() createModuleDto: CreateModuleDto) {
    return this.contentService.createModule(createModuleDto);
  }
}
