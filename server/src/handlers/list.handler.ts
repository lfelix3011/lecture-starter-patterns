import type { Socket } from 'socket.io';

import { ListEvent, LogLevelEnum } from '../common/enums/enums';
import { List } from '../data/models/list';
import { SocketHandler } from './socket.handler';
import { logger } from '../common/logger/logger';
import { isStringNullOrEmpty } from '../common/helpers/utilities';
import { GenericError } from '../data/models/generic-error';

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
    socket.on(ListEvent.RENAME, this.changeTitle.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    try {
      callback(this.db.getData());
      logger.log('Get Lists', LogLevelEnum.INFO);
    } catch (error) {
      this.handleError(error);
    }
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    try {
      this.db.saveState();
      const lists = this.db.getData();
      const reorderedLists = this.reorderService.reorder(lists, sourceIndex, destinationIndex);

      this.updateListAndEmit(reorderedLists);
      this.logInfo('List was reordered');
    } catch (error) {
      this.handleError(error);
    }
  }

  private createList(name: string): void {
    try {
      if (isStringNullOrEmpty(name)) {
        const errorMessage: string = 'List name cannot be empty';
        throw new GenericError({ internalMessage: errorMessage, userMessage: errorMessage });
      }

      this.db.saveState();
      const lists = this.db.getData();
      const newList = new List(name);

      this.updateListAndEmit([...lists, newList]);
      this.logInfo(`New list ${name} created`);
    } catch (error) {
      this.handleError(error);
    }
  }

  private deleteList(id: string): void {
    try {
      this.db.saveState();
      this.db.deleteData(id);
      this.updateLists();
      this.logInfo(`Delete list ${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  private changeTitle({ id, title }: { id: string; title: string }): void {
    try {
      if (isStringNullOrEmpty(title)) {
        const errorMessage: string = 'Title cannot be empty';
        throw new GenericError({ internalMessage: errorMessage, userMessage: errorMessage });
      }

      this.db.saveState();
      const list = this.db.getDataById(id);
      list.name = title;

      const lists = this.db.getData();
      this.updateListAndEmit(lists);
      this.logInfo(`Change title of list ${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export { ListHandler };
