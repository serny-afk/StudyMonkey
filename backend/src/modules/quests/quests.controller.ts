import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateQuestDto } from './dto/create-quest.dto';
import { QuestsService } from './quests.service';

@Controller('quests')
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createQuest(
    @Req() request: AuthenticatedRequest,
    @Body() createQuestDto: CreateQuestDto,
  ) {
    return this.questsService.createQuest(
      request.user.id,
      createQuestDto.title ?? '',
      Number(createQuestDto.plannedDurationMinutes),
    );
  }
}
