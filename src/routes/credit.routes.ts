import { Router } from '../utils/router';
import { creditService } from '../services/credit.service';
import { authenticateRequest } from '../utils/http';

export const creditRoutes = new Router();

creditRoutes.get('/credits/balance', async ({ request }) => {
  const user = await authenticateRequest(request);
  const balance = await creditService.getBalance(user.userId);

  return {
    success: true,
    data: { credits: balance },
  };
});

creditRoutes.post('/credits/add', async ({ request, body }) => {
  const user = await authenticateRequest(request);
  const result = await creditService.addCredits(
    user.userId,
    body.amount,
    body.description
  );

  return {
    success: true,
    data: result,
  };
});

creditRoutes.get('/credits/history', async ({ request, query }) => {
  const user = await authenticateRequest(request);
  const limit = query.limit ? parseInt(query.limit) : 50;
  const transactions = await creditService.getTransactionHistory(user.userId, limit);

  return {
    success: true,
    data: transactions,
  };
});
