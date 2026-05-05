// User Controller — handles user movie lists, stats, and activity
// TODO: Implement in Lab 3

// const { UserMovie, Movie } = require('../models');
// const { Op } = require('sequelize');

// exports.getMovies = async (req, res) => {
//   try {
//     const { status, sort = 'title-asc' } = req.query;
//     const userId = req.user.id;
//
//     const where = { userId };
//     if (status) where.status = status;
//
//     const order = [];
//     switch (sort) {
//       case 'title-asc': order.push([Movie, 'title', 'ASC']); break;
//       case 'title-desc': order.push([Movie, 'title', 'DESC']); break;
//       case 'year-newest': order.push([Movie, 'year', 'DESC']); break;
//       case 'year-oldest': order.push([Movie, 'year', 'ASC']); break;
//       case 'rating-desc': order.push(['userRating', 'DESC']); break;
//     }
//
//     const userMovies = await UserMovie.findAll({
//       where,
//       include: [{ model: Movie }],
//       order,
//     });
//
//     res.json(userMovies);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch movies' });
//   }
// };

// exports.addMovie = async (req, res) => {
//   try {
//     const { imdbId, status } = req.body;
//     const userId = req.user.id;
//
//     let movie = await Movie.findOne({ where: { imdbId } });
//     if (!movie) {
//       // Fetch from OMDB and save
//       // movie = await Movie.create({ ... });
//     }
//
//     const userMovie = await UserMovie.create({
//       userId, movieId: movie.id, status
//     });
//
//     res.status(201).json(userMovie);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to add movie' });
//   }
// };

// exports.updateMovie = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updates = req.body;
//     const userId = req.user.id;
//
//     const userMovie = await UserMovie.findOne({ where: { id, userId } });
//     if (!userMovie) return res.status(404).json({ error: 'Not found' });
//
//     await userMovie.update(updates);
//     res.json(userMovie);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to update movie' });
//   }
// };

// exports.deleteMovie = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user.id;
//
//     const userMovie = await UserMovie.findOne({ where: { id, userId } });
//     if (!userMovie) return res.status(404).json({ error: 'Not found' });
//
//     await userMovie.destroy();
//     res.json({ success: true });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to delete movie' });
//   }
// };

// exports.getStats = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     // Aggregate stats from UserMovie + Movie tables
//     res.json({
//       totalWatched: 0,
//       totalMinutes: 0,
//       avgRating: 0,
//       reviewsCount: 0,
//       topGenres: [],
//       topDirectors: [],
//       ratingDistribution: {},
//     });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch stats' });
//   }
// };

// exports.getActivity = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { year = 2026 } = req.query;
//     // Query UserMovie grouped by watchedAt date
//     res.json([]);
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch activity' });
//   }
// };

// exports.getProfile = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     // Return user profile with stats
//     res.json({ id: userId, name: '', email: '' });
//   } catch (error) {
//     res.status(500).json({ error: 'Failed to fetch profile' });
//   }
// };
