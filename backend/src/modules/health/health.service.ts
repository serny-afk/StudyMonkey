import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';

@Injectable()
export class HealthService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getHealth() {
    const database = await this.databaseService.checkConnection();

    return {
      status: 'ok',
      database: {
        status: 'connected',
        name: database.current_database,
        checkedAt: database.now,
      },
    };
  }
}
