export const validateLoginInput = (
  email: unknown,
  password: unknown
): { valid: boolean; error?: string } => {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' };
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return { valid: false, error: 'Invalid input format' };
  }
  return { valid: true };
};
