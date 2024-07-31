import { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { MementoEvent } from '../common/enums/enums';
import { REDO_ACTION_KEY, UNDO_ACTION_KEY } from '../common/constants/keyboard.constant';

const useMemento = (socket: Socket) => {
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (!event.ctrlKey) return;

      const keyPressed = event.key.toUpperCase();
      if (keyPressed === UNDO_ACTION_KEY) {
        event.preventDefault();
        socket.emit(MementoEvent.UNDO);
        return;
      }

      if (keyPressed === REDO_ACTION_KEY) {
        event.preventDefault();
        socket.emit(MementoEvent.REDO);
        return;
      }
    };

    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [socket]);
};

export { useMemento };
