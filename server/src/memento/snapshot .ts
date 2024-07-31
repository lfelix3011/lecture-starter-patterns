import { Memento } from './memento';
import { isNullOrUndefined } from '../common/helpers/utilities';

// PATTERN: Memento
class Snapshot<T> {
  private undoStack: Memento<T>[] = [];
  private redoStack: Memento<T>[] = [];

  public saveState(state: T): void {
    const lastState = new Memento(state);
    this.undoStack.push(lastState);
    this.redoStack = [];
  }

  public undo(currentState: T): T | null {
    const memento = this.undoStack.pop();
    if (isNullOrUndefined<Memento<T>>(memento)) return null;

    const mementoState = memento.getState();
    const lastState = new Memento(currentState);
    this.redoStack.push(lastState);
    return mementoState;
  }

  public redo(currentState: T): T | null {
    const memento = this.redoStack.pop();
    if (isNullOrUndefined<Memento<T>>(memento)) return null;

    const mementoState = memento.getState();
    const lastState = new Memento(currentState);
    this.undoStack.push(lastState);
    return mementoState;
  }
}

export { Snapshot };
