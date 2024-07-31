import path = require('path');
import { LogLevel } from '../types/log-level.type';
import { LoggerSubscriber } from './logger-subscriber';
import * as fs from 'fs';

export class FileLogger implements LoggerSubscriber {
  private logFilePath = path.join(process.cwd(), 'logs', 'app.log');

  constructor() {
    const logDir = path.dirname(this.logFilePath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    if (!fs.existsSync(this.logFilePath)) {
      fs.writeFileSync(this.logFilePath, '');
    }
  }

  update(message: string, level: LogLevel): void {
    const formattedMessage: string = `${new Date().toISOString()} [${level.toUpperCase()}]: ${message}\n`;
    fs.appendFile(this.logFilePath, formattedMessage, (err) => {
      if (err) throw err;
    });
  }
}
