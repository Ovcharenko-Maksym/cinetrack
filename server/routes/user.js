// User Routes — user movie lists, stats, activity
// TODO: Implement in Lab 3

// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const {
//   getMovies, addMovie, updateMovie, deleteMovie,
//   getStats, getActivity, getProfile
// } = require('../controllers/userController');

// // All user routes require authentication
// router.use(auth);

// // GET /api/user/movies?status=watched&sort=title-asc
// router.get('/movies', getMovies);

// // POST /api/user/movies
// // Body: { imdbId, status }
// router.post('/movies', addMovie);

// // PUT /api/user/movies/:id
// // Body: { status?, userRating?, review? }
// router.put('/movies/:id', updateMovie);

// // DELETE /api/user/movies/:id
// router.delete('/movies/:id', deleteMovie);

// // GET /api/user/stats
// router.get('/stats', getStats);

// // GET /api/user/activity?year=2026
// router.get('/activity', getActivity);

// // GET /api/user/profile
// router.get('/profile', getProfile);

// module.exports = router;
