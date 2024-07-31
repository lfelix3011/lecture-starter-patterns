import { LogLevel } from '../types/types';

interface LoggerSubscriber {
  update: (message: string, level: LogLevel) => void;
}

export { LoggerSubscriber };
