import request from 'supertest';
import app      from '../../src/app';
import sequelize from '../../src/config/database';
import User      from '../../src/models/User';
import Client    from '../../src/models/Client';
import Quotation from '../../src/models/Quotation';
import bcrypt    from 'bcryptjs';

describe('Quotations API', () => {
  let adminToken: string;
  let clientId:   string;
  let quotId:     string;

  beforeAll(async () => {
    await sequelize.authenticate();
    await User.sync({ force: false });
    await Client.sync({ force: false });
    await Quotation.sync({ force: false });

    const hash = await bcrypt.hash('Test@123', 12);
    await User.findOrCreate({
      where: { email: 'quottest@admin.com' },
      defaults: {
        name: 'Quot Test Admin', email: 'quottest@admin.com',
        password_hash: hash, role: 'ADMIN', is_active: true,
      },
    });

    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'quottest@admin.com', password: 'Test@123' });
    adminToken = loginRes.body.data.token;

    const clientRes = await request(app)
      .post('/api/v1/clients')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Client', phone: '9000000001' });
    clientId = clientRes.body.data.id;
  }, 20000);

  afterAll(async () => {
    await Quotation.destroy({ where: {} });
    await Client.destroy({ where: { id: clientId } });
    await User.destroy({ where: { email: 'quottest@admin.com' } });
    await sequelize.close();
  }, 15000);

  const basePayload = () => ({
    client_id:  clientId,
    subject:    'Wedding photography package',
    line_items: [
      { description: 'Full day shoot', qty: 1, unit: 'Day', rate: 25000, amount: 25000 },
      { description: 'Photo album',    qty: 1, unit: 'Pcs', rate: 8500,  amount: 8500  },
    ],
    discount_type:  'PERCENT',
    discount_value: 5,
    tax_type:       'IGST',
    tax_rate:       18,
    notes:          '50% advance required',
  });

  it('✅ POST /quotations — creates with correct totals', async () => {
    const res = await request(app)
      .post('/api/v1/quotations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(basePayload());

    expect(res.status).toBe(201);
    expect(res.body.data.quot_number).toMatch(/BAN-QT-\d{4}-\d{3}/);
    expect(res.body.data.status).toBe('DRAFT');
    // subtotal = 33500, discount 5% = 1675, taxable = 31825, igst 18% = 5728.5, total = 37553.5
    expect(Number(res.body.data.subtotal)).toBe(33500);
    expect(Number(res.body.data.discount_amount)).toBe(1675);
    expect(Number(res.body.data.grand_total)).toBe(37553.5);
    quotId = res.body.data.id;
  });

  it('✅ POST /quotations — 400 with empty line items', async () => {
    const res = await request(app)
      .post('/api/v1/quotations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...basePayload(), line_items: [] });
    expect(res.status).toBe(400);
  });

  it('✅ GET /quotations — returns list', async () => {
    const res = await request(app)
      .get('/api/v1/quotations')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('✅ GET /quotations?status=DRAFT — filters correctly', async () => {
    const res = await request(app)
      .get('/api/v1/quotations?status=DRAFT')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.every((q: any) => q.status === 'DRAFT')).toBe(true);
  });

  it('✅ GET /quotations/:id — returns with client', async () => {
    const res = await request(app)
      .get(`/api/v1/quotations/${quotId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.client.name).toBe('Test Client');
  });

  it('✅ PUT /quotations/:id — updates draft', async () => {
    const res = await request(app)
      .put(`/api/v1/quotations/${quotId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ subject: 'Updated subject' });
    expect(res.status).toBe(200);
    expect(res.body.data.subject).toBe('Updated subject');
  });

  it('✅ POST /quotations/:id/finalise — status becomes FINALISED', async () => {
    const res = await request(app)
      .post(`/api/v1/quotations/${quotId}/finalise`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('FINALISED');
  });

  it('✅ PUT /quotations/:id — 409 if already finalised', async () => {
    const res = await request(app)
      .put(`/api/v1/quotations/${quotId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ subject: 'Try to edit' });
    expect(res.status).toBe(409);
  });

  it('✅ GET /quotations — 401 without token', async () => {
    const res = await request(app).get('/api/v1/quotations');
    expect(res.status).toBe(401);
  });
});
