/**
 * Database Integration Tests
 * Tests database connection and Sequelize configuration
 */
import sequelize from '../../src/config/database';

describe('Database Connection', () => {
  // Close database connection after all tests complete
  afterAll(async () => {
    await sequelize.close();
  });

  // Test: Successfully connect to database
  it('should connect to the database successfully', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  },20000); // Increase timeout for database connection

  // Test: Verify PostgreSQL dialect is configured
  it('should have correct dialect configured', () => {
    expect(sequelize.getDialect()).toBe('postgres');
  });
});
