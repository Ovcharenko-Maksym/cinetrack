const jwt = require('jsonwebtoken');

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('$2a$10$mockedhashvalue'),
  compare: jest.fn(),
}));

jest.mock('../../server/models', () => ({
  User: { findOne: jest.fn(), create: jest.fn() },
  ActivityLog: { create: jest.fn().mockResolvedValue({}) },
}));

const request = require('supertest');
const express = require('express');
const authRoutes = require('../../server/routes/auth');
const { User } = require('../../server/models');

process.env.JWT_SECRET = 'test-jwt-secret-key';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/auth', authRoutes);
  app.use((err, _req, res, _next) => res.status(500).json({ error: 'Internal server error' }));
  return app;
}

describe('Auth API', () => {
  let app;
  beforeAll(() => { app = createApp(); });
  beforeEach(() => { jest.clearAllMocks(); });

  test('POST /register — creates user and returns token', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({ id: 1, name: 'John', email: 'john@example.com' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'John', email: 'john@example.com', password: 'securepass123' });

    expect(res.status).toBe(201);
    expect(res.body.user).toEqual({ id: 1, name: 'John', email: 'john@example.com' });
    expect(jwt.verify(res.body.token, process.env.JWT_SECRET)).toHaveProperty('id', 1);
  });

  test('POST /login — returns user and token for valid credentials', async () => {
    User.findOne.mockResolvedValue({
      id: 1, name: 'John', email: 'john@example.com',
      validatePassword: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'securepass123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('POST /login — rejects invalid credentials with 401', async () => {
    User.findOne.mockResolvedValue({
      id: 1, name: 'John', email: 'john@example.com',
      validatePassword: jest.fn().mockResolvedValue(false),
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'john@example.com', password: 'wrongpass' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });
});
