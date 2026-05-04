import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import {
  CharacterRecord,
  PublicUser,
  RegisteredUser,
  UserRecord,
} from './users.types';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async createUserWithCharacter(
    email: string,
    passwordHash: string,
  ): Promise<RegisteredUser> {
    return this.databaseService.withTransaction(async (client) => {
      const userResult = await client.query<PublicUser & { email: string }>(
        `
          INSERT INTO users (email, password_hash)
          VALUES ($1, $2)
          RETURNING
            id,
            email,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [email, passwordHash],
      );

      const user = userResult.rows[0];

      const characterResult = await client.query<CharacterRecord>(
        `
          INSERT INTO characters (user_id)
          VALUES ($1)
          RETURNING
            id,
            user_id AS "userId",
            xp,
            level,
            created_at AS "createdAt",
            updated_at AS "updatedAt"
        `,
        [user.id],
      );

      return {
        user,
        character: characterResult.rows[0],
      };
    });
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const result = await this.databaseService.query<UserRecord>(
      `
        SELECT
          id,
          email,
          password_hash AS "passwordHash",
          created_at AS "createdAt",
          updated_at AS "updatedAt"
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }
}
