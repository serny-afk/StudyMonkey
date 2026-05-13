import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { CharacterRecord } from '../users/users.types';
import { CompleteQuestResult, QuestSessionRecord } from './quests.types';

@Injectable()
export class QuestsService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async ensureNoOtherInProgressQuest(
    userId: string,
    excludedQuestId?: string,
  ): Promise<void> {
    const params = excludedQuestId ? [userId, excludedQuestId] : [userId];
    const exclusionClause = excludedQuestId ? 'AND id <> $2' : '';

    const result = await this.databaseService.query<{ id: string }>(
      `
        SELECT id
        FROM quest_sessions
        WHERE user_id = $1
          AND status IN ('active', 'paused')
          ${exclusionClause}
        LIMIT 1
      `,
      params,
    );

    if (result.rows[0]) {
      throw new ConflictException(
        'You already have an in-progress quest. Complete or pause that flow before starting another.',
      );
    }
  }

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

    await this.ensureNoOtherInProgressQuest(userId, questId);

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

    await this.ensureNoOtherInProgressQuest(userId, questId);

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
  ): Promise<CompleteQuestResult> {
    return this.databaseService.withTransaction(async (client) => {
      const questResult = await client.query<QuestSessionRecord>(
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
          FOR UPDATE
        `,
        [questId, userId],
      );

      const quest = questResult.rows[0];
      if (!quest) {
        throw new NotFoundException('Quest not found.');
      }

      if (quest.status !== 'active' && quest.status !== 'paused') {
        throw new ConflictException(
          'Only active or paused quests can be completed.',
        );
      }

      const shouldAccumulateActiveSegment =
        quest.status === 'active' && quest.lastResumedAt !== null;

      const completedQuestResult = await client.query<QuestSessionRecord>(
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

      const completedQuest = completedQuestResult.rows[0];
      const xpAwarded = this.calculateXpAward(
        completedQuest.actualDurationSeconds,
      );

      const characterResult = await client.query<CharacterRecord>(
        `
          UPDATE characters
          SET
            xp = xp + $2,
            level = FLOOR((xp + $2) / 100.0)::INTEGER + 1
          WHERE user_id = $1
          RETURNING
            id,
            user_id AS "userId",
            xp,
            level,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [userId, xpAwarded],
      );

      const character = characterResult.rows[0];
      if (!character) {
        throw new NotFoundException('Character not found.');
      }

      return {
        quest: completedQuest,
        xpAwarded,
        character,
      };
    });
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

  private calculateXpAward(actualDurationSeconds: number): number {
    return Math.floor(actualDurationSeconds / 60);
  }
}
