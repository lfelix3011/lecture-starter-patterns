import { LogLevelEnum } from '../enums/log-level.enum';
import { LogLevel } from '../types/log-level.type';
import { LoggerSubscriber } from './logger-subscriber';

export class ConsoleLogger implements LoggerSubscriber {
  update(message: string, level: LogLevel): void {
    if (level === LogLevelEnum.ERROR) {
      console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
    }
  }
}
