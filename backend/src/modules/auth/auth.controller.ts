import { Request, Response } from 'express';

import { loginService } from './auth.service';
import { AuthRequest } from '../../middleware/auth';
import { validateLoginInput } from '../../utils/validation';

/**
 * Controller for POST /login
 * Validates input, calls loginService, and returns JWT + user info.
 */
export const login = async (req: Request, res: Response): Promise<void> => {
    console.log('Login endpoint hit', req.body); 
  const { email, password } = req.body;
  // Validate input using utility
  const { valid, error } = validateLoginInput(email, password);
  if (!valid) {
    res.status(400).json({ success: false, message: error });
    return;
  }
  try {
    const result = await loginService(email, password);
    res.status(200).json({ success: true, data: result, message: 'Login successful' });
  } catch (error: unknown) {
    // Log the error for debugging
    console.error('Login error:', error);
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Controller for GET /me
 * Returns the authenticated user's info from JWT.
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  res.status(200).json({ success: true, data: req.user });
};

/**
 * Controller for POST /logout
 * JWT is stateless, so client just discards the token.
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};