import { socket, SocketContext } from './context/socket';
import { Workspace } from './pages/Workspace';
import { ModalProvider } from './provider/modal';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <ModalProvider>
        <Workspace />
      </ModalProvider>
    </SocketContext.Provider>
  );
}

export { App };
