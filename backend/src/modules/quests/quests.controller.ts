import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateQuestDto } from './dto/create-quest.dto';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getQuests(@Req() request: AuthenticatedRequest) {
    return this.questsService.getQuestsForUser(request.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getQuestById(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) questId: string,
  ) {
    return this.questsService.getQuestByIdForUser(request.user.id, questId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  startQuest(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) questId: string,
  ) {
    return this.questsService.startQuest(request.user.id, questId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/pause')
  pauseQuest(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) questId: string,
  ) {
    return this.questsService.pauseQuest(request.user.id, questId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/resume')
  resumeQuest(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) questId: string,
  ) {
    return this.questsService.resumeQuest(request.user.id, questId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/complete')
  completeQuest(
    @Req() request: AuthenticatedRequest,
    @Param('id', new ParseUUIDPipe({ version: '4' })) questId: string,
  ) {
    return this.questsService.completeQuest(request.user.id, questId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createQuest(
    @Req() request: AuthenticatedRequest,
    @Body() createQuestDto: CreateQuestDto,
  ) {
    return this.questsService.createQuest(
      request.user.id,
      createQuestDto.title,
      createQuestDto.plannedDurationMinutes,
    );
  }
}
