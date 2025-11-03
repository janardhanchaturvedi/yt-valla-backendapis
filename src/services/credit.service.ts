import { prisma } from '../utils/prisma';
import { InsufficientCreditsError, BadRequestError } from '../utils/errors';

export class CreditService {
  async getBalance(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    return user.credits;
  }

  async addCredits(userId: string, amount: number, description: string = 'Credits added') {
    if (amount <= 0) {
      throw new BadRequestError('Amount must be positive');
    }

    // Update user credits and create transaction in a transaction
    const [user, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { increment: amount } },
        select: { credits: true },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'credit',
          amount,
          description,
        },
      }),
    ]);

    return { credits: user.credits, transaction };
  }

  async deductCredits(userId: string, amount: number, description: string = 'Credits deducted') {
    if (amount <= 0) {
      throw new BadRequestError('Amount must be positive');
    }

    // Check if user has enough credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { credits: true },
    });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    if (user.credits < amount) {
      throw new InsufficientCreditsError(`Insufficient credits. You have ${user.credits} credits but need ${amount}`);
    }

    // Deduct credits and create transaction
    const [updatedUser, transaction] = await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: amount } },
        select: { credits: true },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'debit',
          amount,
          description,
        },
      }),
    ]);

    return { credits: updatedUser.credits, transaction };
  }

  async getTransactionHistory(userId: string, limit: number = 50) {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return transactions;
  }
}

export const creditService = new CreditService();
