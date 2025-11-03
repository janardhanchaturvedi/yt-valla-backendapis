import { Router } from '../utils/router';
import { authService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../utils/validations';
import { jwt } from '../utils/jwt';
import { authenticateRequest } from '../utils/http';

export const authRoutes = new Router();

authRoutes.post('/auth/register', async ({ body }) => {
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
});

authRoutes.post('/auth/login', async ({ body }) => {
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
});

authRoutes.get('/auth/me', async ({ request }) => {
  const user = await authenticateRequest(request);
  const userData = await authService.getUserById(user.userId);

  return {
    success: true,
    data: userData,
  };
});
