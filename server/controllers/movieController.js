const axios = require("axios");
const { Sequelize } = require("sequelize");
const { UserList } = require("../models");

const OMDB_BASE = "http://www.omdbapi.com/";

const omdbCache = new Map();

function clean(value) {
  return value && value !== "N/A" ? value : null;
}

function mapSearchMovie(movie) {
  return {
    imdbId: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    poster: clean(movie.Poster),
    type: movie.Type,
  };
}

function mapMovieDetails(movie) {
  return {
    imdbId: movie.imdbID,
    title: movie.Title,
    year: movie.Year,
    genre: clean(movie.Genre) || "",
    director: clean(movie.Director) || "",
    actors: clean(movie.Actors) || "",
    plot: clean(movie.Plot) || "",
    poster: clean(movie.Poster),
    imdbRating: clean(movie.imdbRating) || "",
    runtime: clean(movie.Runtime) || "",
  };
}

async function fetchOmdb(params) {
  const key = JSON.stringify(params);
  if (omdbCache.has(key)) return omdbCache.get(key);

  const { data } = await axios.get(OMDB_BASE, {
    params: { ...params, apikey: process.env.OMDB_API_KEY },
    timeout: 8000,
  });

  if (data.Response !== "False") {
    omdbCache.set(key, data);
  }
  return data;
}

async function fetchByTitle(title) {
  const data = await fetchOmdb({ t: title, type: "movie" });
  if (data.Response === "False") return null;
  return mapMovieDetails(data);
}

const COLLECTIONS = {
  classics: {
    title: "Timeless Classics",
    movies: [
      "The Shawshank Redemption",
      "The Godfather",
      "12 Angry Men",
      "Casablanca",
      "Schindler's List",
      "Goodfellas",
    ],
  },
  "best-thrillers": {
    title: "Best Thrillers",
    movies: [
      "Se7en",
      "The Silence of the Lambs",
      "Gone Girl",
      "No Country for Old Men",
      "Memento",
      "Prisoners",
    ],
  },
  "sci-fi": {
    title: "Sci-Fi Essentials",
    movies: [
      "Interstellar",
      "Blade Runner 2049",
      "The Matrix",
      "Arrival",
      "2001: A Space Odyssey",
      "Ex Machina",
    ],
  },
  nolan: {
    title: "Christopher Nolan",
    movies: [
      "Inception",
      "The Dark Knight",
      "Interstellar",
      "Tenet",
      "Dunkirk",
      "The Prestige",
    ],
  },
  tarantino: {
    title: "Quentin Tarantino",
    movies: [
      "Pulp Fiction",
      "Kill Bill: Vol. 1",
      "Django Unchained",
      "Inglourious Basterds",
      "Once Upon a Time in Hollywood",
      "Reservoir Dogs",
    ],
  },
  scorsese: {
    title: "Martin Scorsese",
    movies: [
      "Goodfellas",
      "The Departed",
      "Taxi Driver",
      "The Wolf of Wall Street",
      "Raging Bull",
      "Casino",
    ],
  },
  horror: {
    title: "Horror Picks",
    movies: [
      "The Shining",
      "Get Out",
      "Hereditary",
      "The Exorcist",
      "A Quiet Place",
      "Midsommar",
    ],
  },
  animation: {
    title: "Animated Masterpieces",
    movies: [
      "Spirited Away",
      "Spider-Man: Into the Spider-Verse",
      "Inside Out",
      "WALL-E",
      "Coco",
      "Ratatouille",
    ],
  },
  "90s": {
    title: "Best of the 90s",
    movies: [
      "Fight Club",
      "Forrest Gump",
      "The Matrix",
      "Pulp Fiction",
      "The Shawshank Redemption",
      "Good Will Hunting",
    ],
  },
  "mind-bending": {
    title: "Mind-Bending Films",
    movies: [
      "Inception",
      "Shutter Island",
      "The Prestige",
      "Memento",
      "Donnie Darko",
      "Eternal Sunshine of the Spotless Mind",
    ],
  },
  "feel-good": {
    title: "Feel-Good Movies",
    movies: [
      "The Grand Budapest Hotel",
      "Up",
      "La La Land",
      "About Time",
      "The Intouchables",
      "Forrest Gump",
    ],
  },
  oscar: {
    title: "Oscar Winners",
    movies: [
      "Parasite",
      "Moonlight",
      "The Shape of Water",
      "Spotlight",
      "Birdman",
      "12 Years a Slave",
    ],
  },
};

exports.search = async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    if (!q) {
      return res.status(400).json({ error: "Query parameter q is required" });
    }

    const data = await fetchOmdb({ s: q, type: "movie" });
    if (data.Response === "False" || !Array.isArray(data.Search)) {
      return res.json([]);
    }

    return res.json(data.Search.map(mapSearchMovie));
  } catch (error) {
    return next(error);
  }
};

exports.getDetails = async (req, res, next) => {
  try {
    const data = await fetchOmdb({ i: req.params.imdbId, plot: "full" });
    if (data.Response === "False") {
      return res.status(404).json({ error: "Movie not found" });
    }

    return res.json(mapMovieDetails(data));
  } catch (error) {
    return next(error);
  }
};

const POPULAR_FALLBACK = [
  "The Shawshank Redemption",
  "The Dark Knight",
  "Inception",
  "Pulp Fiction",
  "Fight Club",
  "Forrest Gump",
  "The Matrix",
  "Goodfellas",
  "Interstellar",
  "The Godfather",
  "Parasite",
  "Whiplash",
  "The Prestige",
  "Gladiator",
  "Se7en",
  "Django Unchained",
  "The Wolf of Wall Street",
  "Shutter Island",
  "Joker",
  "The Grand Budapest Hotel",
  "Schindler's List",
  "The Departed",
  "Saving Private Ryan",
  "The Green Mile",
  "The Silence of the Lambs",
  "Back to the Future",
  "Spirited Away",
  "The Lion King",
  "Titanic",
  "Jurassic Park",
  "Braveheart",
  "The Truman Show",
  "Alien",
  "Terminator 2: Judgment Day",
  "Raiders of the Lost Ark",
  "Blade Runner",
  "No Country for Old Men",
  "Gone Girl",
  "Mad Max: Fury Road",
  "Arrival",
];

exports.getTop = async (req, res, next) => {
  try {
    const rows = await UserList.findAll({
      attributes: ['imdb_id', [Sequelize.fn('COUNT', Sequelize.col('imdb_id')), 'count']],
      where: { status: 'watched' },
      group: ['imdb_id'],
      order: [[Sequelize.literal('count'), 'DESC']],
      limit: 40,
      raw: true,
    });

    const dbMovies = await Promise.all(
      rows
        .filter((row) => row.imdb_id)
        .map(async (row) => {
          try {
            const data = await fetchOmdb({ i: row.imdb_id, plot: 'short' });
            if (data.Response === 'False') return null;
            return { ...mapMovieDetails(data), count: Number(row.count) };
          } catch {
            return null;
          }
        })
    );

    const result = dbMovies.filter(Boolean);
    const existingIds = new Set(result.map((m) => m.imdbId));

    if (result.length < 40) {
      const fallbackResults = await Promise.all(
        POPULAR_FALLBACK.map(async (title) => {
          try { return await fetchByTitle(title); } catch { return null; }
        })
      );
      for (const movie of fallbackResults) {
        if (movie && !existingIds.has(movie.imdbId) && result.length < 40) {
          existingIds.add(movie.imdbId);
          result.push(movie);
        }
      }
    }

    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

exports.getCollections = async (_req, res) => {
  return res.json(
    Object.entries(COLLECTIONS).map(([id, col]) => ({ id, title: col.title })),
  );
};

exports.getCollection = async (req, res, next) => {
  try {
    const col = COLLECTIONS[req.params.id];
    if (!col) {
      return res.status(404).json({ error: "Collection not found" });
    }

    const movies = await Promise.all(col.movies.map(fetchByTitle));
    return res.json({
      id: req.params.id,
      title: col.title,
      movies: movies.filter(Boolean),
    });
  } catch (error) {
    return next(error);
  }
};
