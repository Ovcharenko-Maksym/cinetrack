import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const movieCache = new Map();

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

async function fetchMovieById(imdbId) {
  if (movieCache.has(imdbId)) return movieCache.get(imdbId);
  const { data } = await api.get(`/movies/${encodeURIComponent(imdbId)}`);
  movieCache.set(imdbId, data);
  return data;
}

export async function register(name, email, password) {
  const { data } = await api.post('/auth/register', { name, email, password });
  setAuthToken(data.token);
  return data;
}

export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  setAuthToken(data.token);
  return data;
}

export async function searchMovies(query) {
  const { data } = await api.get('/movies/search', { params: { q: query } });
  return data;
}

export async function getMovieDetails(imdbId) {
  return fetchMovieById(imdbId);
}

export async function getTopMovies() {
  const { data } = await api.get('/movies/top');
  return data;
}

export async function getCollections() {
  const { data } = await api.get('/movies/collections');
  return data;
}

export async function getCollection(id) {
  const { data } = await api.get(`/movies/collections/${encodeURIComponent(id)}`);
  return data;
}

function movieFromCustom(customMovie) {
  if (!customMovie) return null;
  return {
    imdbId: `custom-${customMovie.id}`,
    title: customMovie.title,
    year: customMovie.year,
    poster: customMovie.posterUrl,
    genre: customMovie.genre || '',
    director: customMovie.director || '',
    plot: customMovie.description || '',
  };
}

export async function getUserMovies(status, sort = 'title-asc') {
  const { data } = await api.get('/user/movies', { params: { status, sort } });
  const enriched = await Promise.all(data.map(async (item) => {
    if (item.imdbId) {
      try {
        return { ...item, movie: await getMovieDetails(item.imdbId) };
      } catch {
        return { ...item, movie: null };
      }
    }
    return { ...item, movie: movieFromCustom(item.customMovie) };
  }));

  switch (sort) {
    case 'title-asc':
      enriched.sort((a, b) => (a.movie?.title || '').localeCompare(b.movie?.title || ''));
      break;
    case 'title-desc':
      enriched.sort((a, b) => (b.movie?.title || '').localeCompare(a.movie?.title || ''));
      break;
    case 'year-newest':
      enriched.sort((a, b) => (b.movie?.year || 0) - (a.movie?.year || 0));
      break;
    case 'year-oldest':
      enriched.sort((a, b) => (a.movie?.year || 0) - (b.movie?.year || 0));
      break;
    case 'rating-desc':
      enriched.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
      break;
    default:
      break;
  }

  return enriched;
}

export async function addUserMovie(identifier, status) {
  const body = typeof identifier === 'number'
    ? { customMovieId: identifier, status }
    : { imdbId: identifier, status };
  const { data } = await api.post('/user/movies', body);
  const movie = data.imdbId ? await getMovieDetails(data.imdbId) : movieFromCustom(data.customMovie);
  return { ...data, movie };
}

export async function moveUserMovie(listItemId, newStatus) {
  const { data } = await api.put(`/user/movies/${listItemId}`, { status: newStatus });
  return data;
}

export async function updateUserMovie(id, data) {
  const { data: updated } = await api.put(`/user/movies/${id}`, data);
  return updated;
}

export async function deleteUserMovie(id) {
  const { data } = await api.delete(`/user/movies/${id}`);
  return data;
}

export async function getUserStats() {
  const { data } = await api.get('/user/stats');
  return data;
}

export async function getUserActivity(year = new Date().getFullYear()) {
  const { data } = await api.get('/user/activity', { params: { year } });
  return data;
}

export async function getCustomMovies() {
  const { data } = await api.get('/user/custom-movies');
  return data;
}

export async function addCustomMovie(movie) {
  const { data } = await api.post('/user/custom-movies', movie);
  return data;
}

export async function updateCustomMovie(id, movie) {
  const { data } = await api.put(`/user/custom-movies/${id}`, movie);
  return data;
}

export async function deleteCustomMovie(id) {
  const { data } = await api.delete(`/user/custom-movies/${id}`);
  return data;
}

export async function getUserProfile() {
  const { data } = await api.get('/user/profile');
  return data;
}

export async function updateUserProfile(profile) {
  const { data } = await api.put('/user/profile', profile);
  return data;
}

export default api;
