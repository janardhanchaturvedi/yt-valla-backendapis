import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { bearer } from '@elysiajs/bearer';
import { config } from '../utils/config';

export const authMiddleware = new Elysia()
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwt.secret,
    })
  )
  .use(bearer())
  .derive(async ({ bearer, jwt }) => {
    if (!bearer) {
      return { user: null };
    }

    const payload = await jwt.verify(bearer);
    
    if (!payload) {
      return { user: null };
    }

    return {
      user: {
        id: payload.userId as string,
        email: payload.email as string,
      },
    };
  });
