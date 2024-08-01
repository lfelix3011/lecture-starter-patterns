import { ConsoleLogger } from './common/logger/console-logger';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import { lists } from './assets/mock-data';
import { Database } from './data/database';
import { CardHandler, ListHandler, MementoHandler } from './handlers/handlers';
import { ReorderService } from './services/reorder.service';
import { FileLogger } from './common/logger/file-logger';
import { logger } from './common/logger/logger';
import { ReorderServiceProxy } from './proxy/proxy';

const PORT = process.env.PORT || 3005;

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const db = Database.Instance;
// PATTERN: Proxy
const reorderService = new ReorderService();
const reorderServiceProxy = new ReorderServiceProxy(reorderService);

if (process.env.NODE_ENV !== 'production') {
  db.setData(lists);
}

const onConnection = (socket: Socket): void => {
  new ListHandler(io, db, reorderServiceProxy).handleConnection(socket);
  new CardHandler(io, db, reorderServiceProxy).handleConnection(socket);
  new MementoHandler(io, db, reorderServiceProxy).handleConnection(socket);
};

io.on('connection', onConnection);

// PATTERN: Observer
const initializeLoggers = () => {
  const fileLogger = new FileLogger();
  const consoleLogger = new ConsoleLogger();
  logger.subscribe(fileLogger);
  logger.subscribe(consoleLogger);
};

httpServer.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  initializeLoggers();
});

export { httpServer };
