import type { Socket } from 'socket.io';

import { LogLevelEnum, MementoEvent } from '../common/enums/enums';
import { SocketHandler } from './socket.handler';
import { isEmptyArray } from '../common/helpers/utilities';

// PATTERN: Memento
class MementoHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(MementoEvent.UNDO, this.undo.bind(this));
    socket.on(MementoEvent.REDO, this.redo.bind(this));
  }

  private undo(): void {
    const currentState = this.db.getData();
    const state = this.db.GetSnapshot().undo(currentState);
    if (isEmptyArray(state)) return;

    this.updateListAndEmit(state);
    this.logInfo('Undo operation', LogLevelEnum.WARNING);
  }

  private redo(): void {
    const currentState = this.db.getData();
    const state = this.db.GetSnapshot().redo(currentState);
    if (isEmptyArray(state)) return;

    this.updateListAndEmit(state);
    this.logInfo('Redo operation', LogLevelEnum.WARNING);
  }
}

export { MementoHandler };
