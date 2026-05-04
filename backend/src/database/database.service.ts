import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResult, QueryResultRow } from 'pg';

type DatabaseConnectionCheck = {
  now: Date;
  current_database: string;
};

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  private readonly pool: Pool;

  constructor(private readonly configService: ConfigService) {
    const databaseUrl = this.configService.getOrThrow<string>('DATABASE_URL');
    const useSsl =
      !databaseUrl.includes('localhost') && !databaseUrl.includes('127.0.0.1');

    this.pool = new Pool({
      connectionString: databaseUrl,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });
  }

  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    params: unknown[] = [],
  ): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async checkConnection(): Promise<DatabaseConnectionCheck> {
    const result = await this.query<DatabaseConnectionCheck>(
      'SELECT NOW() AS now, current_database() AS current_database',
    );

    return result.rows[0];
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
