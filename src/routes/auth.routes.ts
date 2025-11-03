import { Elysia, t } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validations';
import { config } from '../utils/config';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: config.jwt.secret,
    })
  )
  .post(
    '/register',
    async ({ body, jwt }) => {
      const validatedData = registerSchema.parse(body);
      const user = await authService.register(validatedData);

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
      });

      return {
        success: true,
        data: {
          user,
          token,
        },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        name: t.Optional(t.String()),
      }),
    }
  )
  .post(
    '/login',
    async ({ body, jwt }) => {
      const validatedData = loginSchema.parse(body);
      const user = await authService.login(validatedData);

      const token = await jwt.sign({
        userId: user.id,
        email: user.email,
      });

      return {
        success: true,
        data: {
          user,
          token,
        },
      };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    }
  )
  .use(authMiddleware)
  .get('/me', async ({ user }) => {
    const userData = await authService.getUserById(user.id);

    return {
      success: true,
      data: userData,
    };
  });
