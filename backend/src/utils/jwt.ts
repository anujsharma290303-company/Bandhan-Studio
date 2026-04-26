import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types';

// Secret and expiration for JWT tokens, loaded from environment
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

/**
 * Generate a signed JWT token for a user payload.
 * @param payload - User info to encode in the token
 * @returns JWT string
 */
export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
};

/**
 * Verify a JWT token and return the decoded payload.
 * Throws if token is invalid or expired.
 * @param token - JWT string
 * @returns Decoded JwtPayload
 */
export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};