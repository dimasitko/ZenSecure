import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MatchService {
  async getUserMatches(currentUserId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { user1Id: currentUserId },
          { user2Id: currentUserId },
        ],
      },
    });

    const formattedMatches = await Promise.all(
      matches.map(async (match) => {
        const otherUserId = match.user1Id === currentUserId ? match.user2Id : match.user1Id;
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: { id: true, name: true, photoUrl: true },
        });

        const lastMessage = await prisma.message.findFirst({
          where: { matchId: match.id },
          orderBy: { createdAt: 'desc' },
          select: { content: true, createdAt: true, senderId: true },
        });

        return {
          id: match.id, 
          user: otherUser,
          lastMessage: lastMessage ? lastMessage.content : null,
          updatedAt: lastMessage ? lastMessage.createdAt : match.createdAt,
          unread: lastMessage ? lastMessage.senderId !== currentUserId : false,
        };
      })
    );
    return formattedMatches.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }
}