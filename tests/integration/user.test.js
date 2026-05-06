const jwt = require('jsonwebtoken');

jest.mock('../../server/models', () => ({
  sequelize: { query: jest.fn() },
  User: { findByPk: jest.fn() },
  CustomMovie: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
  UserList: { findOne: jest.fn(), findAll: jest.fn(), findByPk: jest.fn(), create: jest.fn() },
  ActivityLog: { create: jest.fn().mockResolvedValue({}) },
}));

const request = require('supertest');
const express = require('express');
const userRoutes = require('../../server/routes/user');
const { UserList, ActivityLog } = require('../../server/models');

process.env.JWT_SECRET = 'test-jwt-secret-key';
const TOKEN = jwt.sign({ id: 1, email: 'test@example.com' }, process.env.JWT_SECRET);

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/user', userRoutes);
  app.use((err, _req, res, _next) => res.status(500).json({ error: 'Internal server error' }));
  return app;
}

describe('User API', () => {
  let app;
  beforeAll(() => { app = createApp(); });
  beforeEach(() => { jest.clearAllMocks(); });

  test('GET /movies — returns user movie list', async () => {
    UserList.findAll.mockResolvedValue([
      { id: 1, status: 'watchlist', user_rating: null, review: null, watched_at: null, imdb_id: 'tt0111161', CustomMovie: null },
    ]);

    const res = await request(app).get('/api/user/movies').set('Authorization', `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].imdbId).toBe('tt0111161');
  });

  test('POST /movies — adds movie to watchlist', async () => {
    UserList.findOne.mockResolvedValue(null);
    UserList.create.mockResolvedValue({ id: 10 });
    UserList.findByPk.mockResolvedValue({
      id: 10, status: 'watchlist', user_rating: null, review: null,
      watched_at: null, imdb_id: 'tt1375666', CustomMovie: null,
    });

    const res = await request(app).post('/api/user/movies')
      .set('Authorization', `Bearer ${TOKEN}`)
      .send({ imdbId: 'tt1375666', status: 'watchlist' });

    expect(res.status).toBe(201);
    expect(res.body.imdbId).toBe('tt1375666');
    expect(ActivityLog.create).toHaveBeenCalled();
  });

  test('DELETE /movies/:id — removes movie from list', async () => {
    UserList.findByPk.mockResolvedValue({
      id: 1, user_id: 1, imdb_id: 'tt0111161',
      destroy: jest.fn().mockResolvedValue({}),
    });

    const res = await request(app).delete('/api/user/movies/1')
      .set('Authorization', `Bearer ${TOKEN}`);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
