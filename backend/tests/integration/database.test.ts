import sequelize from '../../src/config/database';

describe('Database Connection', () => {
  afterAll(async () => {
    await sequelize.close();
  });

  it('should connect to the database successfully', async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it('should have correct dialect configured', () => {
    expect(sequelize.getDialect()).toBe('postgres');
  });
});
