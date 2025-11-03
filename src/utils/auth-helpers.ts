export function requireAuth(user: any) {
  if (!user) {
    return {
      success: false,
      error: {
        message: 'No authorization token provided',
        code: 'UNAUTHORIZED',
        statusCode: 401,
      },
    };
  }
  return null;
}
