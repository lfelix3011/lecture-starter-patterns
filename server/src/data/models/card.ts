import { Clonable } from './clonable';

class Card extends Clonable<Card> {
  public name: string;
  public description: string;

  public constructor(name: string, description: string) {
    super();
    this.name = name;
    this.description = description;
  }

  // PATTERN:Prototype
  public clone(): Card {
    const card = new Card(this.name, this.description);
    return card;
  }
}

export { Card };
