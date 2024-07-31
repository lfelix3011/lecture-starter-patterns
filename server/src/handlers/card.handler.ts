import type { Socket } from 'socket.io';
import { CardEvent } from '../common/enums/enums';
import { Card } from '../data/models/card';
import { SocketHandler } from './socket.handler';
import { isStringNullOrEmpty } from '../common/helpers/utilities';
import { GenericError } from '../data/models/generic-error';

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.CLONE, this.cloneCard.bind(this));
    socket.on(CardEvent.RENAME, this.changeTitle.bind(this));
    socket.on(CardEvent.CHANGE_DESCRIPTION, this.changeDescription.bind(this));
  }

  private createCard({ listId, cardName }: { listId: string; cardName: string }): void {
    try {
      if (isStringNullOrEmpty(cardName)) {
        const errorMessage: string = 'Card name cannot be empty';
        throw new GenericError({ internalMessage: errorMessage, userMessage: errorMessage });
      }

      this.db.saveState();
      const list = this.db.getDataById(listId);
      const newCard = new Card(cardName, '');
      list.setCards([...list.cards, newCard]);

      const updatedLists = this.db.getData();
      this.updateListAndEmit(updatedLists);
      this.logInfo(`Card created on list ${listId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    try {
      this.db.saveState();
      const lists = this.db.getData();
      const reordered = this.reorderService.reorderCards({
        lists,
        sourceIndex,
        destinationIndex,
        sourceListId,
        destinationListId,
      });

      this.updateListAndEmit(reordered);
      this.logInfo('Card reorder');
    } catch (error) {
      this.handleError(error);
    }
  }

  private deleteCard({ listId, cardId }: { listId: string; cardId: string }): void {
    try {
      this.db.saveState();
      const list = this.db.getDataById(listId);
      list.removeCard(cardId);

      const updatedLists = this.db.getData();
      this.updateListAndEmit(updatedLists);
      this.logInfo(`Card deleted on list ${listId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  private cloneCard({ listId, cardId }: { listId: string; cardId: string }): void {
    try {
      this.db.saveState();
      const list = this.db.getDataById(listId);
      const card = list.getCardById(cardId);

      // PATTERN:Prototype
      const newCard = card.clone();
      list.setCards([...list.cards, newCard]);

      const updatedLists = this.db.getData();
      this.updateListAndEmit(updatedLists);
      this.logInfo(`Card cloned on list ${listId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  private changeTitle({ listId, cardId, title }: { listId: string; cardId: string; title: string }): void {
    try {
      if (isStringNullOrEmpty(title)) {
        const errorMessage: string = 'Title cannot be empty';
        throw new GenericError({ internalMessage: errorMessage, userMessage: errorMessage });
      }

      this.db.saveState();
      const list = this.db.getDataById(listId);
      const card = list.getCardById(cardId);
      card.name = title;

      const updatedLists = this.db.getData();
      this.updateListAndEmit(updatedLists);
      this.logInfo(`Card title changed on list ${listId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  private changeDescription({
    listId,
    cardId,
    description,
  }: {
    listId: string;
    cardId: string;
    description: string;
  }): void {
    try {
      this.db.saveState();
      const list = this.db.getDataById(listId);
      const card = list.getCardById(cardId);
      card.description = description;

      const updatedLists = this.db.getData();
      this.updateListAndEmit(updatedLists);
      this.logInfo(`Card description changed on list ${listId}`);
    } catch (error) {
      this.handleError(error);
    }
  }
}

export { CardHandler };
