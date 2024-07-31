import { randomUUID } from 'crypto';

abstract class Clonable<T> {
  public id: string;
  public createdAt: Date;

  public constructor() {
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  public abstract clone(): T;
}

export { Clonable };
