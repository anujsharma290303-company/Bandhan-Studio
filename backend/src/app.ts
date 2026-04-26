/**
 * Main Express application setup for Bandan Studio API
 * Configures security, CORS, rate limiting, routes, and error handling
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/database';
import authRoutes from './modules/auth/auth.routes';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Confirm app initialization
console.log('Express app initialized');

// Log every request (should be first middleware)
app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

// Security headers
app.use(helmet());
// Enable CORS for frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
// Basic rate limiting to prevent abuse
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
// Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register authentication routes
app.use('/api/v1/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Bandan Studio API is running' });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

// Start server after connecting to database
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();

export default app;