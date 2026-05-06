jest.mock('axios');
jest.mock('../../server/models', () => ({
  UserList: { findAll: jest.fn() },
  sequelize: { query: jest.fn() },
}));

const request = require('supertest');
const express = require('express');
const axios = require('axios');
const movieRoutes = require('../../server/routes/movies');

process.env.OMDB_API_KEY = 'test-omdb-key';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/movies', movieRoutes);
  app.use((err, _req, res, _next) => res.status(500).json({ error: 'Internal server error' }));
  return app;
}

describe('Movies API', () => {
  let app;
  beforeAll(() => { app = createApp(); });
  beforeEach(() => { jest.clearAllMocks(); });

  test('GET /search — returns mapped results from OMDB', async () => {
    axios.get.mockResolvedValue({
      data: {
        Response: 'True',
        Search: [{ imdbID: 'tt0111161', Title: 'The Shawshank Redemption', Year: '1994', Poster: 'https://img.com/p.jpg', Type: 'movie' }],
      },
    });

    const res = await request(app).get('/api/movies/search').query({ q: 'Shawshank' });

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({ imdbId: 'tt0111161', title: 'The Shawshank Redemption' });
  });

  test('GET /:imdbId — returns 404 for unknown movie', async () => {
    axios.get.mockResolvedValue({ data: { Response: 'False', Error: 'Incorrect IMDb ID.' } });

    const res = await request(app).get('/api/movies/tt0000000');

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Movie not found');
  });
});
