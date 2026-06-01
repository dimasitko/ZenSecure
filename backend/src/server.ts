import app from './app';
import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  },
});

httpServer.listen(PORT, () => {
  console.log(`ZenMatch Backend is running on http://localhost:${PORT}`);
});