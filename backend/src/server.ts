import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupChatSockets } from './sockets/chat.socket';

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

setupChatSockets(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});