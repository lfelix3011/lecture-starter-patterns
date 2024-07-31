import { Server, Socket } from 'socket.io';

import { GeneralEvent, ListEvent, LogLevelEnum } from '../common/enums/enums';
import { Database } from '../data/database';
import { logger } from '../common/logger/logger';
import { GenericError } from '../data/models/generic-error';
import { List } from '../data/models/list';
import { IReorderService } from '../common/interfaces/interfaces';
import { LogLevel } from '../common/types/types';

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: IReorderService;

  protected io: Server;

  public constructor(io: Server, db: Database, reorderService: IReorderService) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }

  protected updateListAndEmit(lists: List[]): void {
    this.db.setData(lists);
    this.updateLists();
  }

  protected logInfo(message: string, logLevel: LogLevel = LogLevelEnum.INFO): void {
    logger.log(message, logLevel);
  }

  protected handleError(error: Error): void {
    if (error instanceof GenericError) {
      logger.log(error.message, LogLevelEnum.ERROR);
      this.io.emit(GeneralEvent.ERROR, error.userMessage);

      return;
    }

    logger.log('An unexpected error occurred', LogLevelEnum.ERROR);
  }
}

export { SocketHandler };
