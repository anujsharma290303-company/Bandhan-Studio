/**
 * Database configuration for Bandan Studio backend
 *
 * - Loads environment variables
 * - Configures Sequelize for PostgreSQL
 * - Handles SSL for production
 * - Exports a connectDB() helper for server startup
 */

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load environment variables from .env file (required for DATABASE_URL)
dotenv.config();

/**
 * Sequelize instance for PostgreSQL connection.
 * - Uses DATABASE_URL from environment
 * - Enables SSL for production (required for many cloud DBs)
 * - Connection pool settings are tuned for small/medium apps
 */
const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Accept self-signed certs (adjust for prod)
    },
  },
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 3,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

/**
 * Connect to the database and log status.
 * Exits process if connection fails (prevents server from starting with bad DB config).
 *
 * Usage: await connectDB();
 */
export const connectDB = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default sequelize;

