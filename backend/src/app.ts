/**
 * Main Express application setup for Bandan Studio API
 *
 * Responsibilities:
 * - Loads environment variables
 * - Configures security headers, CORS, and rate limiting
 * - Sets up request body parsing
 * - Registers API routes (auth, health)
 * - Handles 404s and starts the server
 *
 * To add new modules, import their routes and register with app.use()
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';

import authRoutes from './modules/auth/auth.routes';
import clientRoutes from './modules/clients/client.routes';

// Load environment variables from .env file (must be called before using process.env)
dotenv.config();

const app = express();

// Confirm app initialization (for debugging)
console.log('Express app initialized');

// Log every request (for debugging and monitoring)
app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

// Add security headers
app.use(helmet());

// Enable CORS for frontend (adjust origin as needed for deployment)
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Basic rate limiting to prevent abuse (100 requests per 15 minutes per IP)
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Parse JSON and URL-encoded bodies for incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clients', clientRoutes);

// Health check endpoint (for uptime monitoring)
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Bandan Studio API is running' });
});

// Test route for debugging
app.get('/test', (req, res) => res.json({ ok: true }));

// 404 handler for unknown routes (must be last)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

export default app;