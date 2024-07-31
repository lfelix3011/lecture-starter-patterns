import type { DraggableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";
import { CardEvent } from "../../common/enums/enums";
import { SocketContext } from "../../context/socket";
import { useContext } from "react";

type Props = {
  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  cardListId: string;
};

export const CardItem = ({ card, isDragging, provided, cardListId }: Props) => {
  const socket = useContext(SocketContext);

  const deleteCardItem = (): void => {
    socket.emit(CardEvent.DELETE, { listId: cardListId, cardId: card.id });
  };

  const cloneCardItem = (): void => {
    socket.emit(CardEvent.CLONE, { listId: cardListId, cardId: card.id });
  };

  const changeTitle = (title: string): void => {
    socket.emit(CardEvent.RENAME, {
      listId: cardListId,
      cardId: card.id,
      title,
    });
  };

  const changeDescription = (description: string): void => {
    socket.emit(CardEvent.CHANGE_DESCRIPTION, {
      listId: cardListId,
      cardId: card.id,
      description,
    });
  };

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title
          onChange={changeTitle}
          title={card.name}
          fontSize="large"
          isBold
        />
        <Text text={card.description} onChange={changeDescription} />
        <Footer>
          <DeleteButton onClick={deleteCardItem} />
          <Splitter />
          <CopyButton onClick={cloneCardItem} />
        </Footer>
      </Content>
    </Container>
  );
};
