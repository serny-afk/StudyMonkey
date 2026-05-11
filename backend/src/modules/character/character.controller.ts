import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import type { AuthenticatedRequest } from '../auth/auth.types';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CharacterService } from './character.service';

@Controller('character')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentCharacter(@Req() request: AuthenticatedRequest) {
    return this.characterService.getCurrentCharacter(request.user.id);
  }
}
