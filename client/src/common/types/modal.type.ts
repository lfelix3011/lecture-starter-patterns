import { ReactNode } from 'react';

interface ModalContextType {
  modalContent: ReactNode;
  openModal: (content: ReactNode) => void;
  closeModal: () => void;
}

export type { ModalContextType };
