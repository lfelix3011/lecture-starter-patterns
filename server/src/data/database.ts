import { Constants } from '../common/constants/constants';
import { Snapshot } from '../memento/snapshot ';
import { GenericError } from './models/generic-error';
import { List } from './models/list';

class Database {
  private static instance: Database | null = null;
  private snapshot: Snapshot<List[]>;
  private data: List[];

  private constructor() {
    this.data = [];
    this.snapshot = new Snapshot<List[]>();
  }

  public static get Instance(): Database {
    if (!this.instance) {
      this.instance = new Database();
    }

    return this.instance;
  }

  public GetSnapshot(): Snapshot<List[]> {
    return this.snapshot;
  }

  public getData(): List[] {
    return this.data;
  }

  public getDataById(id: string): List | undefined {
    const index = this.getIndexByIdOrThrowError(id);
    return this.data[index];
  }

  public setData(data: List[]): void {
    this.data = data;
  }

  public deleteData(id: string): void {
    const index = this.getIndexByIdOrThrowError(id);
    this.saveState();
    this.data.splice(index, 1);
  }

  private getIndexByIdOrThrowError(id: string): number {
    const index = this.data.findIndex((item) => item.id === id);
    if (index === Constants.INDEX_NOT_FOUND) {
      throw new GenericError({
        internalMessage: `List with id ${id} not found`,
        userMessage: 'List not found',
      });
    }
    return index;
  }

  public saveState(): void {
    const state = this.data.map((list) => list.clone());
    this.snapshot.saveState(state);
  }
}

export { Database };
