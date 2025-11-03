import { Elysia, t } from 'elysia';
import { creditService } from '../services/credit.service';
import { authMiddleware } from '../middlewares/auth.middleware';

export const creditRoutes = new Elysia({ prefix: '/credits' })
  .use(authMiddleware)
  .get('/balance', async ({ user }) => {
    const balance = await creditService.getBalance(user.id);

    return {
      success: true,
      data: { credits: balance },
    };
  })
  .post(
    '/add',
    async ({ user, body }) => {
      const result = await creditService.addCredits(
        user.id,
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
  .get('/history', async ({ user, query }) => {
    const limit = query.limit ? parseInt(query.limit) : 50;
    const transactions = await creditService.getTransactionHistory(user.id, limit);

    return {
      success: true,
      data: transactions,
    };
  });
