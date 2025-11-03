import { Elysia } from 'elysia';
import { AppError } from '../utils/errors';

export const errorMiddleware = new Elysia()
  .onError(({ code, error, set }) => {
    console.error('Error:', error);

    if (error instanceof AppError) {
      set.status = error.statusCode;
      return {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
        },
      };
    }

    // Validation errors from Elysia
    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          statusCode: 400,
          details: error.message,
        },
      };
    }

    // Default error response
    set.status = 500;
    return {
      success: false,
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        statusCode: 500,
      },
    };
  });
