import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

const OMDB_API_KEY = '42da3fa9';
const OMDB_BASE = 'https://www.omdbapi.com';

const omdb = axios.create({
  baseURL: OMDB_BASE,
  params: { apikey: OMDB_API_KEY },
});

// In-memory cache for fetched movie details (persists during session)
const movieCache = new Map();

async function fetchMovieById(imdbId, plot = 'short') {
  if (movieCache.has(imdbId)) return movieCache.get(imdbId);
  try {
    const { data } = await omdb.get('/', { params: { i: imdbId, plot } });
    if (data.Response === 'True') {
      const movie = mapOmdbMovie(data);
      movieCache.set(imdbId, movie);
      return movie;
    }
  } catch {}
  return null;
}

function mapOmdbMovie(m) {
  return {
    imdbId: m.imdbID,
    title: m.Title,
    year: m.Year,
    poster: m.Poster !== 'N/A' ? m.Poster : null,
    genre: m.Genre || '',
    director: m.Director || '',
    imdbRating: m.imdbRating || '',
    runtime: m.Runtime || '',
    plot: m.Plot || '',
  };
}

const TOP_MOVIE_IDS = [
  'tt0111161', 'tt0068646', 'tt0468569', 'tt0071562',
  'tt0050083', 'tt0108052', 'tt0167260', 'tt0110912',
  'tt0120737', 'tt0137523',
];

// Extended list of well-known movie IDs for director search coverage
const EXTENDED_MOVIE_IDS = [
  // Nolan
  'tt0468569', 'tt1375666', 'tt0816692', 'tt0482571', 'tt6723592', 'tt0209144', 'tt0154420',
  // Spielberg
  'tt0108052', 'tt0120815', 'tt0317705', 'tt0107290', 'tt0082971', 'tt0087469',
  // Tarantino
  'tt0110912', 'tt0217869', 'tt0361748', 'tt1853728', 'tt3460252', 'tt0266697',
  // Scorsese
  'tt0099685', 'tt0407887', 'tt1302006', 'tt0078788', 'tt0112641',
  // Fincher
  'tt0137523', 'tt1568346', 'tt0114369', 'tt0432283', 'tt7740496',
  // Villeneuve
  'tt1160419', 'tt3659388', 'tt1856101', 'tt8613568',
  // Kubrick
  'tt0081505', 'tt0066921', 'tt0062622', 'tt0120382',
  // Coppola
  'tt0068646', 'tt0071562', 'tt0078788',
  // Peter Jackson
  'tt0167260', 'tt0120737', 'tt0167261',
  // Ridley Scott
  'tt0078748', 'tt0083658', 'tt0172495',
  // Wes Anderson
  'tt0362270', 'tt1748122', 'tt5104604',
  // Coen Brothers
  'tt0477348', 'tt0589042', 'tt1210166',
  // James Cameron
  'tt0499549', 'tt0103064', 'tt0120338',
  // David Lynch
  'tt0166924', 'tt0090756',
  // Park Chan-wook
  'tt0364569',
  // Bong Joon-ho
  'tt6751668', 'tt1706620',
  // Guy Ritchie
  'tt0208092', 'tt0144117',
  // Martin McDonagh
  'tt5580390', 'tt11813216',
  // Damien Chazelle
  'tt2582802', 'tt3783958',
  // Jordan Peele
  'tt5052448', 'tt6857112',
  // Greta Gerwig
  'tt1517451', 'tt3566834',
];

// Auth (mock — no backend yet)
export async function register(name, email, password) {
  const user = { id: 1, name, email };
  const token = 'mock-jwt-token-' + Date.now();
  return { user, token };
}

export async function login(email, password) {
  const user = { id: 1, name: 'John Doe', email };
  const token = 'mock-jwt-token-' + Date.now();
  return { user, token };
}

// Movies (real OMDb API)
export async function searchMovies(query) {
  try {
    const { data } = await omdb.get('/', { params: { s: query, type: 'movie' } });

    if (data.Response === 'False') return [];

    const results = await Promise.all(
      data.Search.slice(0, 10).map((item) => fetchMovieById(item.imdbID))
    );

    return results.filter(Boolean);
  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}

export async function searchByDirector(directorName) {
  try {
    const query = directorName.toLowerCase();
    const seenIds = new Set();
    const results = [];

    // 1) Check the extended curated list of well-known movies
    const curatedMovies = await Promise.all(
      EXTENDED_MOVIE_IDS.map((id) => fetchMovieById(id))
    );
    curatedMovies.forEach((m) => {
      if (m && m.director && m.director.toLowerCase().includes(query)) {
        if (!seenIds.has(m.imdbId)) {
          seenIds.add(m.imdbId);
          results.push(m);
        }
      }
    });

    // 2) Check movies already in cache from previous searches
    movieCache.forEach((m) => {
      if (m && m.director && m.director.toLowerCase().includes(query)) {
        if (!seenIds.has(m.imdbId)) {
          seenIds.add(m.imdbId);
          results.push(m);
        }
      }
    });

    // 3) Try searching OMDb with parts of the director's name as title query
    //    (catches biopics and movies with the name in the title)
    const nameParts = directorName.trim().split(/\s+/);
    const searchTerms = [directorName, ...nameParts.filter(p => p.length > 3)];
    const uniqueTerms = [...new Set(searchTerms)].slice(0, 3);

    const searchPromises = uniqueTerms.map(async (term) => {
      try {
        const { data } = await omdb.get('/', { params: { s: term, type: 'movie' } });
        if (data.Response === 'True') return data.Search || [];
      } catch {}
      return [];
    });

    const searchResults = (await Promise.all(searchPromises)).flat();
    const newIds = searchResults
      .map((item) => item.imdbID)
      .filter((id) => !seenIds.has(id));

    const newMovies = await Promise.all(
      [...new Set(newIds)].slice(0, 20).map((id) => fetchMovieById(id))
    );

    newMovies.forEach((m) => {
      if (m && m.director && m.director.toLowerCase().includes(query)) {
        if (!seenIds.has(m.imdbId)) {
          seenIds.add(m.imdbId);
          results.push(m);
        }
      }
    });

    // Sort by IMDb rating descending
    results.sort((a, b) => parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0));

    return results;
  } catch (error) {
    console.error('Director search failed:', error);
    return [];
  }
}

export async function getMovieDetails(imdbId) {
  try {
    return await fetchMovieById(imdbId, 'full');
  } catch (error) {
    console.error('Failed to fetch movie details:', error);
    return null;
  }
}

export async function getTopMovies() {
  try {
    const movies = await Promise.all(
      TOP_MOVIE_IDS.map((id) => fetchMovieById(id))
    );
    return movies.filter(Boolean);
  } catch (error) {
    console.error('Failed to fetch top movies:', error);
    return [];
  }
}

// User lists (mock — no backend yet)
let userMovies = [
  { id: 1, imdbId: 'tt0111161', status: 'watched', userRating: 10, review: 'Masterpiece. The ending is perfection.', watchedAt: '2026-03-15' },
  { id: 2, imdbId: 'tt0468569', status: 'watched', userRating: 9, review: 'Ledger was phenomenal as the Joker.', watchedAt: '2026-03-20' },
  { id: 3, imdbId: 'tt0110912', status: 'watched', userRating: 9, review: 'Tarantino at his finest.', watchedAt: '2026-04-01' },
  { id: 4, imdbId: 'tt1375666', status: 'watched', userRating: 9, review: 'Mind-bending.', watchedAt: '2026-04-10' },
  { id: 5, imdbId: 'tt0068646', status: 'watchlist', userRating: null, review: null, watchedAt: null },
  { id: 6, imdbId: 'tt0071562', status: 'watchlist', userRating: null, review: null, watchedAt: null },
  { id: 7, imdbId: 'tt0108052', status: 'watchlist', userRating: null, review: null, watchedAt: null },
  { id: 8, imdbId: 'tt0111161', status: 'favorites', userRating: 10, review: 'All-time favorite.', watchedAt: '2026-03-15' },
  { id: 9, imdbId: 'tt1375666', status: 'favorites', userRating: 9, review: null, watchedAt: '2026-04-10' },
];

let nextId = 10;

export async function getUserMovies(status, sort = 'title-asc') {
  let results = userMovies.filter(m => m.status === status);

  const enriched = await Promise.all(
    results.map(async (item) => {
      const movie = await getMovieDetails(item.imdbId);
      return { ...item, movie };
    })
  );

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

export async function addUserMovie(imdbId, status) {
  const movie = await getMovieDetails(imdbId);
  const entry = { id: nextId++, imdbId, movie, status, userRating: null, review: null, watchedAt: null };
  userMovies.push(entry);
  return entry;
}

export async function updateUserMovie(id, data) {
  const index = userMovies.findIndex(m => m.id === id);
  if (index !== -1) {
    userMovies[index] = { ...userMovies[index], ...data };
    return userMovies[index];
  }
  return null;
}

export async function deleteUserMovie(id) {
  userMovies = userMovies.filter(m => m.id !== id);
  return { success: true };
}

// Stats (mock — no backend yet)
export async function getUserStats() {
  return {
    totalWatched: 47,
    totalMinutes: 6580,
    avgRating: 7.8,
    reviewsCount: 32,
    topGenres: [
      { genre: 'Drama', count: 18 },
      { genre: 'Action', count: 12 },
      { genre: 'Sci-Fi', count: 8 },
      { genre: 'Crime', count: 7 },
      { genre: 'Comedy', count: 5 },
    ],
    topDirectors: [
      { director: 'Christopher Nolan', count: 6 },
      { director: 'Denis Villeneuve', count: 4 },
      { director: 'Martin Scorsese', count: 3 },
      { director: 'Quentin Tarantino', count: 3 },
      { director: 'David Fincher', count: 2 },
    ],
    ratingDistribution: { '1': 0, '2': 1, '3': 1, '4': 2, '5': 3, '6': 5, '7': 10, '8': 12, '9': 8, '10': 5 },
  };
}

export async function getUserActivity(year = 2026) {
  const data = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const random = Math.random();
    let count = 0;

    if (isWeekend) {
      if (random > 0.5) count = Math.floor(Math.random() * 4) + 1;
    } else {
      if (random > 0.75) count = Math.floor(Math.random() * 2) + 1;
    }

    if (count > 0) {
      data.push({ date: d.toISOString().split('T')[0], count });
    }
  }

  return data;
}

export default api;
