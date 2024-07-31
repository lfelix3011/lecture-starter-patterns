import { LogLevel } from '../types/types';
import { LoggerSubscriber } from './logger-subscriber';

class Logger {
  private subscribers: LoggerSubscriber[] = [];

  subscribe(subscriber: LoggerSubscriber) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: LoggerSubscriber) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  log(message: string, level: LogLevel) {
    this.subscribers.forEach((subscriber) => subscriber.update(message, level));
  }
}

export const logger = new Logger();
