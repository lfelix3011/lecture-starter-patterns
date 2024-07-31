import { createContext } from 'react';
import { ModalContextType } from '../common/types/types';

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export { ModalContext };
