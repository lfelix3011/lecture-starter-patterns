import { Constants } from '../../common/constants/constants';
import { Card } from './card';
import { Clonable } from './clonable';
import { GenericError } from './generic-error';

class List extends Clonable<List> {
  public name: string;

  public cards: Card[] = [];

  public constructor(name: string) {
    super();
    this.name = name;
  }

  getCardById(id: string): Card {
    const index = this.getIndexByIdOrThrowError(id);
    return this.cards[index];
  }

  setCards(cards: Card[]) {
    this.cards = cards;

    return this;
  }

  removeCard(id: string) {
    const index = this.getIndexByIdOrThrowError(id);
    this.cards.splice(index, 1);

    return this;
  }

  private getIndexByIdOrThrowError(id: string): number {
    const index = this.cards.findIndex((item) => item.id === id);
    if (index === Constants.INDEX_NOT_FOUND) {
      throw new GenericError({
        internalMessage: `Card with id ${id} not found in list ${this.name}`,
        userMessage: `Card not found in list ${this.name}`,
      });
    }
    return index;
  }

  // PATTERN:Prototype
  public clone(): List {
    const list = new List(this.name);
    list.cards = this.cards.map((card) => card.clone());
    return list;
  }
}

export { List };
