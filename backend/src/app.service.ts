import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo(): string {
    return 'StudyMonkey API is running.';
  }
}
