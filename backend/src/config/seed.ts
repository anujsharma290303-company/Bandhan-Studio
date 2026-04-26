/**
 * Database Seeder Script
 * Populates database with initial admin user for development
 * Run with: npm run seed
 */
import bcrypt from 'bcryptjs';
import sequelize from './database';
import User from '../models/User';

const seed = async () => {
  try {
    // Connect to database and ensure tables exist
    await sequelize.authenticate();
    await User.sync({ alter: true });

    // Check if admin already exists to prevent duplicates
    const existing = await User.findOne({
      where: { email: 'admin@bandanstudio.com' }
    });

    if (existing) {
      console.log('ℹ️  Admin already exists');
      process.exit(0);
    }

    // Hash password with bcrypt (12 salt rounds)
    const password_hash = await bcrypt.hash('Admin@123', 12);

    // Create admin user with hashed password
    await User.create({
      name: 'Admin',
      email: 'admin@bandanstudio.com',
      password_hash,
      role: 'ADMIN',
      is_active: true,
    });

    // Display credentials for login
    console.log('✅ Admin user created');
    console.log('   Email: admin@bandanstudio.com');
    console.log('   Password: Admin@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

// Execute seeder
seed();