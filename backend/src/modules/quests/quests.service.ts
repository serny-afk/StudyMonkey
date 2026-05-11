import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { QuestSessionRecord } from './quests.types';

@Injectable()
export class QuestsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getQuestsForUser(userId: string): Promise<QuestSessionRecord[]> {
    const result = await this.databaseService.query<QuestSessionRecord>(
      `
        SELECT
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
        FROM quest_sessions
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId],
    );

    return result.rows;
  }

  async getQuestByIdForUser(
    userId: string,
    questId: string,
  ): Promise<QuestSessionRecord> {
    const result = await this.databaseService.query<QuestSessionRecord>(
      `
        SELECT
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
        FROM quest_sessions
        WHERE id = $1 AND user_id = $2
        LIMIT 1
      `,
      [questId, userId],
    );

    const quest = result.rows[0];
    if (!quest) {
      throw new NotFoundException('Quest not found.');
    }

    return quest;
  }

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
