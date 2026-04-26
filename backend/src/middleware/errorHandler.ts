import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class for application-specific errors with status codes.
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string
  ) {
    super(message);
  }
}

/**
 * Global error handler middleware for consistent error responses.
 * Handles AppError and unexpected errors.
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }
  // Log unexpected errors for debugging
  console.error('❌ Unexpected error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
