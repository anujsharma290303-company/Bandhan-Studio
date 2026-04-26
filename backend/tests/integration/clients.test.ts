import request from 'supertest';
import app from '../../src/app';
import sequelize from '../../src/config/database';
import User from '../../src/models/User';
import Client from '../../src/models/Client';
import bcrypt from 'bcryptjs';

describe('Clients API', () => {
  let adminToken: string;
  let createdClientId: string;

  beforeAll(async () => {
    await sequelize.authenticate();
    await User.sync({ force: false });
    await Client.sync({ force: false });

    // Create admin test user
    const hash = await bcrypt.hash('Test@123', 12);
    await User.findOrCreate({
      where: { email: 'clienttest@admin.com' },
      defaults: {
        name: 'Client Test Admin',
        email: 'clienttest@admin.com',
        password_hash: hash,
        role: 'ADMIN',
        is_active: true,
      },
    });

    // Login and get token
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'clienttest@admin.com', password: 'Test@123' });

    adminToken = res.body.data.token;
  }, 20000);

  afterAll(async () => {
    await Client.destroy({ where: {} });
    await User.destroy({ where: { email: 'clienttest@admin.com' } });
    await sequelize.close();
  }, 15000);

  it('✅ POST /clients — creates a client', async () => {
    const res = await request(app)
      .post('/api/v1/clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Ravi Sharma',
        phone: '9870012345',
        email: 'ravi@example.com',
        address: '45 Vijay Nagar, Indore',
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe('Ravi Sharma');
    createdClientId = res.body.data.id;
  });

  it('✅ POST /clients — 400 if name missing', async () => {
    const res = await request(app)
      .post('/api/v1/clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ phone: '9870012345' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('✅ GET /clients — returns list', async () => {
    const res = await request(app)
      .get('/api/v1/clients')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('✅ GET /clients?search= — filters by name', async () => {
    const res = await request(app)
      .get('/api/v1/clients?search=Ravi')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data[0].name).toContain('Ravi');
  });

  it('✅ GET /clients/:id — returns single client', async () => {
    const res = await request(app)
      .get(`/api/v1/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(createdClientId);
  });

  it('✅ GET /clients/:id — 404 for unknown id', async () => {
    const res = await request(app)
      .get('/api/v1/clients/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('✅ PUT /clients/:id — updates client', async () => {
    const res = await request(app)
      .put(`/api/v1/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ phone: '9999999999' });

    expect(res.status).toBe(200);
    expect(res.body.data.phone).toBe('9999999999');
  });

  it('✅ GET /clients — 401 without token', async () => {
    const res = await request(app).get('/api/v1/clients');
    expect(res.status).toBe(401);
  });

  it('✅ DELETE /clients/:id — deletes client', async () => {
    const res = await request(app)
      .delete(`/api/v1/clients/${createdClientId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
