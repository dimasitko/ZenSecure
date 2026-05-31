import { Server, Socket } from 'socket.io';
import { PrismaClient }  from '@prisma/client';

const prisma = new PrismaClient();

export const setupChatSockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (roomId: string) => {
      socket.join(roomId);
    });

    socket.on('send_message', async (data: { roomId: string; senderId: string; content: string }) => {
      try {
        const userExists = await prisma.user.findUnique({ 
          where: { id: data.senderId } 
        });

        if (!userExists) {
          await prisma.user.create({
            data: { id: data.senderId, role: 'client' }
          });
          console.log(`New user created: ${data.senderId}`);
        }

        const message = await prisma.message.create({
          data: {
            roomId: data.roomId,
            senderId: data.senderId,
            content: data.content,
          },
        });

        // 3. ВІДПРАВКА КЛІЄНТАМ
        io.to(data.roomId).emit('receive_message', message);
      } catch (error) {
        console.error('Message save error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};