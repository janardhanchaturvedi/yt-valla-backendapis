import bcrypt from 'bcryptjs';
import { prisma } from '../utils/prisma';
import { UnauthorizedError, BadRequestError } from '../utils/errors';
import type { RegisterInput, LoginInput } from '../utils/validations';

export class AuthService {
  async register(data: RegisterInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestError('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with initial credits
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        credits: 100, // Initial signup bonus
      },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        createdAt: true,
      },
    });

    // Create transaction record for initial credits
    await prisma.transaction.create({
      data: {
        userId: user.id,
        type: 'credit',
        amount: 100,
        description: 'Signup bonus',
      },
    });

    return user;
  }

  async login(data: LoginInput) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Return user without password
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
      createdAt: user.createdAt,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    return user;
  }
}

export const authService = new AuthService();
