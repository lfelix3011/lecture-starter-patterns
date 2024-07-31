import { ReactNode, useState } from "react";
import { Backdrop, ModalButton, StyledDialog } from "../components/primitives/styled/modal";
import { ModalContext } from "../context/modal";

const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (content: ReactNode) => {
    setModalContent(content);
    setIsOpen(true);
  };

  const closeModal = () => {
    setModalContent(null);
    setIsOpen(false);
  };

  return (
    <ModalContext.Provider value={{ modalContent, openModal, closeModal }}>
      {children}
      {isOpen && (
        <>
          <Backdrop onClick={closeModal} />
          <StyledDialog open>
            <ModalButton onClick={closeModal}>
              &times;
            </ModalButton>
            {modalContent}
          </StyledDialog>
        </>
      )}
    </ModalContext.Provider>
  );
};

export { ModalProvider }
