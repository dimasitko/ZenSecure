import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class DiscoverService {
  async getFeed(currentUserId: string) {
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { interestedIn: true }
    });

    if (!currentUser) throw new Error("User not found");

    const profiles = await prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        gender: currentUser.interestedIn,
        isApproved: true,
        likesReceived: {
          none: {
            fromUserId: currentUserId
          }
        }
      },
      select: {
        id: true,
        name: true,
        age: true,
        photoUrl: true,
      },
      take: 10
    });

    return profiles;
  }
}