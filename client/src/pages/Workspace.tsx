import type { DraggableLocation, DroppableProvided, DropResult } from '@hello-pangea/dnd';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import React, { useContext, useEffect, useState } from 'react';

import { CardEvent, GeneralEvent, ListEvent } from '../common/enums/enums';
import { type List } from '../common/types/types';
import { Column } from '../components/column/column';
import { ColumnCreator } from '../components/column-creator/column-creator';
import { SocketContext } from '../context/socket';
import { reorderService } from '../services/reorder.service';
import { Container } from './styled/container';
import { useMemento } from '../hooks/useMemento';
import { useModal } from '../hooks/useModal';

export const Workspace = () => {
  const { openModal } = useModal();
  const [lists, setLists] = useState<List[]>([]);

  const socket = useContext(SocketContext);

  useMemento(socket);
  useEffect(() => {
    socket.emit(ListEvent.GET, (lists: List[]) => setLists(lists));
    socket.on(ListEvent.UPDATE, (lists: List[]) => setLists(lists));
    socket.on(GeneralEvent.ERROR, (message: string) => showErrorModal(message));

    return () => {
      socket.removeAllListeners(ListEvent.UPDATE).close();
      socket.removeAllListeners(GeneralEvent.ERROR).close();
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const source: DraggableLocation = result.source;
    const destination: DraggableLocation = result.destination;

    const isNotMoved = source.droppableId === destination.droppableId && source.index === destination?.index;

    if (isNotMoved) {
      return;
    }

    const isReorderLists = result.type === 'COLUMN';

    if (isReorderLists) {
      setLists(reorderService.reorderLists(lists, source.index, destination.index));
      socket.emit(ListEvent.REORDER, source.index, destination.index);

      return;
    }

    setLists(reorderService.reorderCards(lists, source, destination));
    socket.emit(CardEvent.REORDER, {
      sourceListId: source.droppableId,
      destinationListId: destination.droppableId,
      sourceIndex: source.index,
      destinationIndex: destination.index,
    });
  };

  const onCreateList = (name: string): void => {
    socket.emit(ListEvent.CREATE, name);
  };

  const showErrorModal = (message: string): void => {
    openModal(
      <div>
        <h2>Error</h2>
        <p>{message}</p>
      </div>
    );
  };

  return (
    <React.Fragment>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="board" type="COLUMN" direction="horizontal">
          {(provided: DroppableProvided) => (
            <Container className="workspace-container" ref={provided.innerRef} {...provided.droppableProps}>
              {lists.map((list: List, index: number) => (
                <Column key={list.id} index={index} listName={list.name} cards={list.cards} listId={list.id} />
              ))}
              {provided.placeholder}
              <ColumnCreator onCreateList={onCreateList} />
            </Container>
          )}
        </Droppable>
      </DragDropContext>
    </React.Fragment>
  );
};
