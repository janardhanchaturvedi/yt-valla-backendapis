import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { bearer } from '@elysiajs/bearer';
import { config } from '../utils/config';
import { UnauthorizedError } from '../utils/errors';

export const authMiddleware = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwt.secret,
    })
  )
  .use(bearer())
  .derive(async ({ jwt, bearer, set }) => {
    if (!bearer) {
      throw new UnauthorizedError('No authorization token provided');
    }

    const payload = await jwt.verify(bearer);
    
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    return {
      user: {
        id: payload.userId as string,
        email: payload.email as string,
      },
    };
  });
