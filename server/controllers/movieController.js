// Movie Controller — handles movie search, details, and top movies
// TODO: Implement in Lab 3

// const axios = require('axios');
// const { Movie } = require('../models');

// const OMDB_BASE = 'http://www.omdbapi.com';
// const API_KEY = process.env.OMDB_API_KEY;

// exports.search = async (req, res) => {
//   try {
//     const { q } = req.query;
//     if (!q) return res.status(400).json({ error: 'Query parameter required' });
//
//     const response = await axios.get(OMDB_BASE, {
//       params: { apikey: API_KEY, s: q, type: 'movie' }
//     });
//
//     if (response.data.Response === 'False') {
//       return res.json([]);
//     }
//
//     const movies = response.data.Search.map(m => ({
//       imdbId: m.imdbID,
//       title: m.Title,
//       year: m.Year,
//       poster: m.Poster !== 'N/A' ? m.Poster : null,
//       genre: '',
//     }));
//
//     res.json(movies);
//   } catch (error) {
//     res.status(500).json({ error: 'Search failed' });
//   }
// };

// exports.getDetails = async (req, res) => {
//   try {
//     const { imdbId } = req.params;
//
//     const response = await axios.get(OMDB_BASE, {
//       params: { apikey: API_KEY, i: imdbId, plot: 'full' }
//     });
//
//     if (response.data.Response === 'False') {
//       return res.status(404).json({ error: 'Movie not found' });
//     }
//
//     const m = response.data;
//     res.json({
//       imdbId: m.imdbID,
//       title: m.Title,
//       year: m.Year,
//       genre: m.Genre,
//       director: m.Director,
//       poster: m.Poster !== 'N/A' ? m.Poster : null,
//       imdbRating: m.imdbRating,
//       runtime: m.Runtime,
//       plot: m.Plot,
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch movie details' });
//   }
// };

// exports.getTop = async (req, res) => {
//   try {
//     // Return top-rated movies from database or a curated list
//     const movies = await Movie.findAll({
//       order: [['imdbRating', 'DESC']],
//       limit: 10,
//     });
//     res.json(movies);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch top movies' });
//   }
// };
