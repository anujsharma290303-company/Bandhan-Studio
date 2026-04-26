import sequelize from './database';
import User from '../models/User';
import Client from '../models/Client';

const migrate = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    await User.sync({ force: false });
    console.log('✅ Users table ready');

    await Client.sync({ force: false });
    console.log('✅ Clients table ready');

    console.log('✅ Migration complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();