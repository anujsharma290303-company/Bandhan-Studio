/**
 * Auth Integration Tests
 * Tests login, getMe endpoints, JWT token validation, and error handling
 */
import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/config/database';
import User from '../../src/models/User';
import bcrypt from 'bcryptjs';

describe('Auth Endpoints', () => {
  // Setup: Create test database and admin user before running tests
  beforeAll(async () => {
    await sequelize.authenticate();
    await User.sync({ alter: true });

    // Hash test password and create admin user
    const password_hash = await bcrypt.hash('Admin@123', 12);
    await User.findOrCreate({
      where: { email: 'testadmin@bandanstudio.com' },
      defaults: {
        name: 'Test Admin',
        email: 'testadmin@bandanstudio.com',
        password_hash,
        role: 'ADMIN',
        is_active: true,
      },
    });
  }, 15000);  // Increased timeout for database operations

  // Cleanup: Delete test user and close database connection
  afterAll(async () => {
    await User.destroy({ where: { email: 'testadmin@bandanstudio.com' } });
    await sequelize.close();
  }, 15000);

  // Test: Login succeeds with valid credentials and returns JWT token
  it('✅ Login with valid credentials returns token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testadmin@bandanstudio.com', password: 'Admin@123' });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();  // Token returned
    expect(res.body.data.user.role).toBe('ADMIN');  // User role included
  });

  // Test: Login fails with incorrect password
  it('✅ Login with wrong password returns 401', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testadmin@bandanstudio.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  // Test: Login fails if required fields are missing
  it('✅ Login with missing fields returns 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testadmin@bandanstudio.com' });  // Missing password

    expect(res.status).toBe(400);
  });

  // Test: GET /me endpoint requires valid token (401 without token)
  it('✅ GET /me without token returns 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  // Test: GET /me returns current user profile with valid token
  it('✅ GET /me with valid token returns user', async () => {
    // First login to get token
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testadmin@bandanstudio.com', password: 'Admin@123' });

    const token = loginRes.body.data.token;

    // Use token to fetch user profile
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('testadmin@bandanstudio.com');
  });
});