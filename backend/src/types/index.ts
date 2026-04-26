/**
 * User roles available in the system.
 * 'ADMIN' has full access, 'MEMBER' is a regular user.
 */
export type UserRole = 'ADMIN' | 'MEMBER';

/**
 * JWT payload structure for authentication.
 * Used to encode user info in JWT tokens.
 */
export interface JwtPayload {
  id: string;      // User ID
  email: string;   // User email
  role: UserRole;  // User role
}

/**
 * Extends Express Request to include user info from JWT.
 */
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Standard API response format for all endpoints.
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}