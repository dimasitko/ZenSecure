import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class InteractionService {
  async processSwipe(fromUserId: string, toUserId: string, isLike: boolean) {
    const existingInteraction = await prisma.like.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId,
          toUserId,
        },
      },
    });

    if (existingInteraction) {
      throw new Error('You have already interacted with this user.');
    }

    await prisma.like.create({
      data: {
        fromUserId,
        toUserId,
        isLike,
      },
    });

    if (!isLike) {
      return { isMatch: false };
    }

    const mutualLike = await prisma.like.findFirst({
      where: {
        fromUserId: toUserId,
        toUserId: fromUserId,
        isLike: true,
      },
    });

    if (mutualLike) {
      const match = await prisma.match.create({
        data: {
          user1Id: fromUserId,
          user2Id: toUserId,
        },
      });

      return { 
        isMatch: true, 
        matchId: match.id,
        message: "Congratulations, it's a match!" 
      };
    }

    return { isMatch: false };
  }
}