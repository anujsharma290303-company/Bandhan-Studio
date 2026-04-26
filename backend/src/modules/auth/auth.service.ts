import bcrypt from 'bcryptjs';
import User from '../../models/User';
import { generateToken } from '../../utils/jwt';
import { JwtPayload } from '../../types';

/**
 * Result returned by loginService: JWT token and user info.
 */
export interface LoginResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

/**
 * Authenticates a user by email and password.
 * Throws 'INVALID_CREDENTIALS' if login fails.
 * @param email - User's email
 * @param password - Plain text password
 * @returns LoginResult with JWT and user info
 */
export const loginService = async (
  email: string,
  password: string
): Promise<LoginResult> => {
  // Find user by email and check if active
  const user = await User.findOne({ where: { email, is_active: true } });
  if (!user) {
    throw new Error('INVALID_CREDENTIALS');
  }
  // Compare password with stored hash
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw new Error('INVALID_CREDENTIALS');
  }
  // Prepare JWT payload
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  // Generate JWT token
  const token = generateToken(payload);
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};