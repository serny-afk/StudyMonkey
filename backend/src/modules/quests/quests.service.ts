import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { QuestSessionRecord } from './quests.types';

@Injectable()
export class QuestsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createQuest(
    userId: string,
    title: string,
    plannedDurationMinutes: number,
  ): Promise<QuestSessionRecord> {
    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      throw new BadRequestException('Quest title is required.');
    }

    if (
      !Number.isInteger(plannedDurationMinutes) ||
      plannedDurationMinutes <= 0
    ) {
      throw new BadRequestException(
        'Planned duration must be a positive whole number of minutes.',
      );
    }

    const result = await this.databaseService.query<QuestSessionRecord>(
      `
        INSERT INTO quest_sessions (
          user_id,
          title,
          planned_duration_minutes
        )
        VALUES ($1, $2, $3)
        RETURNING
          id,
          user_id AS "userId",
          title,
          planned_duration_minutes AS "plannedDurationMinutes",
          actual_duration_seconds AS "actualDurationSeconds",
          status,
          started_at AS "startedAt",
          last_resumed_at AS "lastResumedAt",
          paused_at AS "pausedAt",
          ended_at AS "endedAt",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
      `,
      [userId, normalizedTitle, plannedDurationMinutes],
    );

    return result.rows[0];
  }
}
