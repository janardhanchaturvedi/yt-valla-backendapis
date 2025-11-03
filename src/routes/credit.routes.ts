import { Elysia, t } from 'elysia';
import { creditService } from '../services/credit.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import { errorMiddleware } from '../middlewares/error.middleware';
import { requireAuth } from '../utils/auth-helpers';

export const creditRoutes = new Elysia({ prefix: '/credits' })
  .use(errorMiddleware)
  .use(authMiddleware)
  .get('/balance', async ({ user, set }) => {
    const authError = requireAuth(user);
    if (authError) {
      set.status = 401;
      return authError;
    }

    const balance = await creditService.getBalance(user!.id);

    return {
      success: true,
      data: { credits: balance },
    };
  })
  .post(
    '/add',
    async ({ user, body, set }) => {
      const authError = requireAuth(user);
      if (authError) {
        set.status = 401;
        return authError;
      }

      const result = await creditService.addCredits(
        user!.id,
        body.amount,
        body.description
      );

      return {
        success: true,
        data: result,
      };
    },
    {
      body: t.Object({
        amount: t.Number(),
        description: t.Optional(t.String()),
      }),
    }
  )
  .get('/history', async ({ user, query, set }) => {
    const authError = requireAuth(user);
    if (authError) {
      set.status = 401;
      return authError;
    }

    const limit = query.limit ? parseInt(query.limit) : 50;
    const transactions = await creditService.getTransactionHistory(user!.id, limit);

    return {
      success: true,
      data: transactions,
    };
  });
