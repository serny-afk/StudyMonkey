import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CharacterRecord } from '../users/users.types';

@Injectable()
export class CharacterService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getCurrentCharacter(userId: string): Promise<CharacterRecord> {
    const result = await this.databaseService.query<CharacterRecord>(
      `
        SELECT
          id,
          user_id AS "userId",
          xp,
          level,
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM characters
        WHERE user_id = $1
        LIMIT 1
      `,
      [userId],
    );

    const character = result.rows[0];
    if (!character) {
      throw new NotFoundException('Character not found.');
    }

    return character;
  }
}
