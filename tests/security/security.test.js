const jwt = require('jsonwebtoken');

jest.mock('../../server/models', () => ({
  sequelize: { query: jest.fn() },
  User: { findOne: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
  CustomMovie: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
  UserList: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
  ActivityLog: { create: jest.fn().mockResolvedValue({}) },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$mockedhash'),
  compare: jest.fn(),
}));

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../server/routes/auth');
const userRoutes = require('../../server/routes/user');
const { User, UserList } = require('../../server/models');

process.env.JWT_SECRET = 'test-jwt-secret-key';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use('/api/user', userRoutes);
  app.use((err, _req, res, _next) => res.status(500).json({ error: 'Internal server error' }));
  return app;
}

describe('Security', () => {
  let app;
  beforeAll(() => { app = createApp(); });
  beforeEach(() => { jest.clearAllMocks(); });

  test('rejects request without Authorization header', async () => {
    const res = await request(app).get('/api/user/movies');
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Authorization token required');
  });

  test('rejects expired JWT token', async () => {
    const token = jwt.sign({ id: 1, email: 'a@b.com' }, process.env.JWT_SECRET, { expiresIn: '-1s' });
    const res = await request(app).get('/api/user/movies').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid or expired token');
  });

  test('prevents user from modifying another user\'s data (IDOR)', async () => {
    const tokenA = jwt.sign({ id: 1, email: 'alice@t.com' }, process.env.JWT_SECRET);
    UserList.findByPk.mockResolvedValue({ id: 10, user_id: 2 });

    const res = await request(app).put('/api/user/movies/10')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ userRating: 9 });

    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Forbidden');
  });

  test('strips XSS tags from user input on registration', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockImplementation((data) => Promise.resolve({ id: 1, name: data.name, email: data.email }));

    const res = await request(app).post('/api/auth/register')
      .send({ name: '<script>alert("xss")</script>', email: 'xss@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.user.name).not.toContain('<script>');
  });
});
