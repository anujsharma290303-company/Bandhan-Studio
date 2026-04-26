import { Router } from 'express';
import { login, getMe, logout } from './auth.controller';
import { authenticate } from '../../middleware/auth';

// Express router for authentication endpoints
const router = Router();

// Login endpoint (public)
router.post('/login', login);
// Get current user info (requires authentication)
router.get('/me', authenticate, getMe);
// Logout endpoint (requires authentication)
router.post('/logout', authenticate, logout);

export default router;