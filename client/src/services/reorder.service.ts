import type { DraggableLocation } from '@hello-pangea/dnd';
import { type Card, type List } from '../common/types/types';

const moveItem = <T>({ startIndex, endIndex, items }: { startIndex: number; endIndex: number; items: T[] }): T[] => {
  const [movedItem] = items.slice(startIndex, startIndex + 1);
  const before = items.slice(0, startIndex);
  const after = items.slice(startIndex + 1);
  return [...before, ...after.slice(0, endIndex), movedItem, ...after.slice(endIndex)];
};

const updateCardOrder = ({
  lists,
  listId,
  startIndex,
  endIndex,
}: {
  lists: List[];
  listId: string;
  startIndex: number;
  endIndex: number;
}): List[] => {
  return lists.map((list) =>
    list.id === listId ? { ...list, cards: moveItem<Card>({ items: list.cards, startIndex, endIndex }) } : list
  );
};

const removeCardFromList = (cards: Card[], index: number): Card[] => {
  return cards.slice(0, index).concat(cards.slice(index + 1));
};

const addCardToList = (cards: Card[], index: number, card: Card): Card[] => {
  return cards.slice(0, index).concat(card).concat(cards.slice(index));
};

const updateListsForCardMovement = ({
  lists,
  sourceListId,
  destinationListId,
  sourceIndex,
  destinationIndex,
}: {
  lists: List[];
  sourceListId: string;
  destinationListId: string;
  sourceIndex: number;
  destinationIndex: number;
}): List[] => {
  const sourceList = lists.find((list) => list.id === sourceListId);
  const destinationList = lists.find((list) => list.id === destinationListId);

  if (!sourceList || !destinationList) return lists;

  const { cards: sourceCards = [] } = sourceList;
  const { cards: destinationCards = [] } = destinationList;
  const cardToMove = sourceCards[sourceIndex];

  return lists.map((list) => {
    if (list.id === sourceListId) {
      return { ...list, cards: removeCardFromList(sourceCards, sourceIndex) };
    }

    if (list.id === destinationListId) {
      return { ...list, cards: addCardToList(destinationCards, destinationIndex, cardToMove) };
    }

    return list;
  });
};

const reorderLists = (items: List[], startIndex: number, endIndex: number): List[] => {
  const orderItems = moveItem<List>({ startIndex, endIndex, items });
  return orderItems;
};

const reorderCards = (lists: List[], source: DraggableLocation, destination: DraggableLocation): List[] => {
  const isMovingInSameList = source.droppableId === destination.droppableId;

  if (isMovingInSameList) {
    return updateCardOrder({
      startIndex: source.index,
      endIndex: destination.index,
      lists,
      listId: source.droppableId,
    });
  }

  return updateListsForCardMovement({
    lists,
    sourceListId: source.droppableId,
    destinationListId: destination.droppableId,
    sourceIndex: source.index,
    destinationIndex: destination.index,
  });
};

export const reorderService = { reorderLists, reorderCards };
