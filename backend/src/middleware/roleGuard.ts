import { Response, NextFunction } from 'express';

/**
 * Middleware to restrict access to ADMIN users only.
 * Use after authentication middleware.
 */
export const requireAdmin = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.',
    });
    return;
  }
  next();
};

/**
 * Middleware to allow any authenticated user (ADMIN or MEMBER).
 * Use after authentication middleware.
 */
export const requireMember = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Not authenticated' });
    return;
  }
  next();
};