import {
  BadRequestException,
  ConflictException,
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

  async startQuest(
    userId: string,
    questId: string,
  ): Promise<QuestSessionRecord> {
    const quest = await this.getQuestByIdForUser(userId, questId);

    if (quest.status !== 'created') {
      throw new ConflictException('Only created quests can be started.');
    }

    const result = await this.databaseService.query<QuestSessionRecord>(
      `
        UPDATE quest_sessions
        SET
          status = 'active',
          started_at = NOW(),
          last_resumed_at = NOW(),
          paused_at = NULL
        WHERE id = $1 AND user_id = $2
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
      [questId, userId],
    );

    return result.rows[0];
  }

  async pauseQuest(
    userId: string,
    questId: string,
  ): Promise<QuestSessionRecord> {
    const quest = await this.getQuestByIdForUser(userId, questId);

    if (quest.status !== 'active') {
      throw new ConflictException('Only active quests can be paused.');
    }

    if (!quest.lastResumedAt) {
      throw new ConflictException(
        'Active quest is missing its current resume timestamp.',
      );
    }

    const result = await this.databaseService.query<QuestSessionRecord>(
      `
        UPDATE quest_sessions
        SET
          status = 'paused',
          actual_duration_seconds = actual_duration_seconds + GREATEST(
            FLOOR(EXTRACT(EPOCH FROM (NOW() - last_resumed_at))),
            0
          )::INTEGER,
          paused_at = NOW(),
          last_resumed_at = NULL
        WHERE id = $1 AND user_id = $2
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
      [questId, userId],
    );

    return result.rows[0];
  }

  async resumeQuest(
    userId: string,
    questId: string,
  ): Promise<QuestSessionRecord> {
    const quest = await this.getQuestByIdForUser(userId, questId);

    if (quest.status !== 'paused') {
      throw new ConflictException('Only paused quests can be resumed.');
    }

    const result = await this.databaseService.query<QuestSessionRecord>(
      `
        UPDATE quest_sessions
        SET
          status = 'active',
          last_resumed_at = NOW(),
          paused_at = NULL
        WHERE id = $1 AND user_id = $2
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
      [questId, userId],
    );

    return result.rows[0];
  }

  async completeQuest(
    userId: string,
    questId: string,
  ): Promise<QuestSessionRecord> {
    const quest = await this.getQuestByIdForUser(userId, questId);

    if (quest.status !== 'active' && quest.status !== 'paused') {
      throw new ConflictException(
        'Only active or paused quests can be completed.',
      );
    }

    const shouldAccumulateActiveSegment =
      quest.status === 'active' && quest.lastResumedAt !== null;

    const result = await this.databaseService.query<QuestSessionRecord>(
      `
        UPDATE quest_sessions
        SET
          status = 'completed',
          actual_duration_seconds = actual_duration_seconds + CASE
            WHEN $3::boolean THEN GREATEST(
              FLOOR(EXTRACT(EPOCH FROM (NOW() - last_resumed_at))),
              0
            )::INTEGER
            ELSE 0
          END,
          ended_at = NOW(),
          paused_at = NULL,
          last_resumed_at = NULL
        WHERE id = $1 AND user_id = $2
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
      [questId, userId, shouldAccumulateActiveSegment],
    );

    return result.rows[0];
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
