import sequelize from './database';
import User from '../models/User';

/**
 * Migration script to sync User model with the database.
 * Does not drop tables (force: false).
 * Run with: npm run migrate
 */
const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');
    // Sync User model (create table if not exists)
    await User.sync({ force: false });
    console.log('✅ Users table ready');
    console.log('✅ Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
migrate();