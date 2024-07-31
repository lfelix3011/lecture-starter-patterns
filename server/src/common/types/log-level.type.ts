import { LogLevelEnum } from '../enums/log-level.enum';
import { ValueOf } from './object/value-of.type';

type LogLevel = ValueOf<typeof LogLevelEnum>;

export type { LogLevel };
